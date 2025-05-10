
-- Create SQL function for getting student courses
CREATE OR REPLACE FUNCTION public.get_student_courses(student_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  code TEXT,
  description TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  doctors JSON,
  exam_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH course_doctors AS (
    SELECT 
      dc.course_id,
      json_agg(json_build_object('id', p.id, 'name', p.name)) as doctors
    FROM doctor_courses dc
    JOIN profiles p ON dc.doctor_id = p.id
    GROUP BY dc.course_id
  ),
  exam_counts AS (
    SELECT 
      course_id,
      COUNT(*) as exam_count
    FROM exams
    WHERE status = 'published'
    GROUP BY course_id
  )
  SELECT 
    c.id,
    c.name,
    c.code,
    '' as description, -- Add description column to courses table if needed
    c.created_at,
    c.updated_at,
    COALESCE(cd.doctors, '[]'::json) as doctors,
    COALESCE(ec.exam_count, 0) as exam_count
  FROM courses c
  LEFT JOIN course_doctors cd ON c.id = cd.course_id
  LEFT JOIN exam_counts ec ON c.id = ec.course_id
  WHERE c.id IN (
    SELECT course_id FROM doctor_courses
    WHERE course_id IN (
      SELECT course_id FROM exams WHERE status = 'published'
    )
  );
END;
$$;

-- Create SQL function for getting student exams
CREATE OR REPLACE FUNCTION public.get_student_exams(student_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  course_id UUID,
  exam_date TIMESTAMPTZ,
  duration TEXT, 
  instructions TEXT,
  status TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  course JSON
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.course_id,
    e.exam_date,
    e.duration,
    e.instructions,
    e.status,
    e.created_by,
    e.created_at,
    e.updated_at,
    json_build_object('name', c.name, 'code', c.code) as course
  FROM exams e
  JOIN courses c ON e.course_id = c.id
  WHERE e.status = 'published'
  ORDER BY e.exam_date DESC;
END;
$$;

-- Create student courses table
CREATE TABLE IF NOT EXISTS public.student_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE public.student_courses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Students can see their own courses" 
  ON student_courses FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Admin users can manage all student courses" 
  ON student_courses
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Doctors can see courses they teach" 
  ON student_courses
  USING (EXISTS (
    SELECT 1 FROM doctor_courses dc 
    WHERE dc.course_id = student_courses.course_id 
    AND dc.doctor_id = auth.uid()
  ));

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import StudentService from '@/services/student.service';
import ExamService from '@/services/exam.service';
import AuthService from '@/services/auth.service';

const ApiDebugger = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    setLoading(name);
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
      toast({
        title: `${name} Test`,
        description: 'API call successful',
      });
    } catch (error: any) {
      console.error(`${name} test failed:`, error);
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          error: error.message || 'Unknown error',
          details: error
        } 
      }));
      toast({
        title: `${name} Test Failed`,
        description: error.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const tests = [
    {
      name: 'Authentication Status',
      test: () => Promise.resolve({
        isAuthenticated: AuthService.isAuthenticated(),
        token: AuthService.getStoredToken(),
        user: AuthService.getStoredUser()
      })
    },
    {
      name: 'Student Courses',
      test: () => StudentService.getStudentCourses()
    },
    {
      name: 'Student Grades',
      test: () => StudentService.getStudentGrades('3')
    },
    {
      name: 'Upcoming Exams',
      test: () => ExamService.getUpcomingExams()
    },
    {
      name: 'Student Results',
      test: () => ExamService.getStudentResults()
    }
  ];

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>API Debugger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tests.map((test) => (
              <div key={test.name} className="flex items-center justify-between p-2 border rounded">
                <span>{test.name}</span>
                <Button
                  onClick={() => testEndpoint(test.name, test.test)}
                  disabled={loading === test.name}
                  size="sm"
                >
                  {loading === test.name ? 'Testing...' : 'Test'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(results).map(([name, result]: [string, any]) => (
                <div key={name} className="border rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{name}</h4>
                    <Badge variant={result.success ? 'default' : 'destructive'}>
                      {result.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiDebugger; 
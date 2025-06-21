import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/auth.service";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
  gender?: string;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    color: "text-gray-400"
  });

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = "";
    let color = "text-gray-400";

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score === 0) {
      feedback = "Very weak";
      color = "text-red-500";
    } else if (score === 1) {
      feedback = "Weak";
      color = "text-orange-500";
    } else if (score === 2) {
      feedback = "Fair";
      color = "text-yellow-500";
    } else if (score === 3) {
      feedback = "Good";
      color = "text-blue-500";
    } else if (score === 4) {
      feedback = "Strong";
      color = "text-green-500";
    } else {
      feedback = "Very strong";
      color = "text-green-600";
    }

    return { score, feedback, color };
  };

  // Real-time validation
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        if (value.trim().length > 50) return "Name must be less than 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Name can only contain letters and spaces";
        break;
      
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        if (value.length > 100) return "Email must be less than 100 characters";
        break;
      
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (value.length > 128) return "Password must be less than 128 characters";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character";
        break;
      
      case "password_confirmation":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords don't match";
        break;
      
      case "role":
        if (!value) return "Please select a role";
        break;
      
      case "gender":
        if (!value) return "Please select your gender";
        break;
    }
    return undefined;
  };

  // Update password strength when password changes
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    }
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: ValidationErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
      }
    });

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    // Additional password strength check
    if (passwordStrength.score < 3) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password for better security",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await AuthService.register({
        ...formData,
        role: formData.role as "student" | "doctor" | "admin",
        gender: formData.gender as "male" | "female" | "other"
      });
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created. Please sign in.",
      });

      onSwitchToLogin();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = () => {
    return Object.keys(formData).every(field => 
      formData[field as keyof typeof formData] && 
      !errors[field as keyof ValidationErrors]
    ) && passwordStrength.score >= 3;
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your information to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name (min 2 characters)"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={loading}
                required
                className={errors.name ? "border-red-500" : formData.name ? "border-green-500" : ""}
                minLength={2}
                maxLength={50}
              />
              {formData.name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {errors.name ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email Address *</Label>
            <div className="relative">
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={loading}
                required
                className={errors.email ? "border-red-500" : formData.email ? "border-green-500" : ""}
                maxLength={100}
              />
              {formData.email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {errors.email ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger className={errors.role ? "border-red-500" : formData.role ? "border-green-500" : ""}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.role}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger className={errors.gender ? "border-red-500" : formData.gender ? "border-green-500" : ""}>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password *</Label>
            <div className="relative">
              <Input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password (min 8 characters)"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={loading}
                required
                className={errors.password ? "border-red-500" : passwordStrength.score >= 3 ? "border-green-500" : ""}
                minLength={8}
                maxLength={128}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Password Strength Meter */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Password strength:</span>
                  <span className={passwordStrength.color}>{passwordStrength.feedback}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 1 ? 'bg-red-500' :
                      passwordStrength.score === 2 ? 'bg-yellow-500' :
                      passwordStrength.score === 3 ? 'bg-blue-500' :
                      passwordStrength.score >= 4 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li className={formData.password.length >= 8 ? "text-green-600" : "text-gray-500"}>
                      At least 8 characters
                    </li>
                    <li className={/[a-z]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
                      At least one lowercase letter
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
                      At least one uppercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
                      At least one number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : "text-gray-500"}>
                      At least one special character
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                disabled={loading}
                required
                className={errors.password_confirmation ? "border-red-500" : formData.password_confirmation && formData.password_confirmation === formData.password ? "border-green-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password_confirmation && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password_confirmation}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !isFormValid()}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="px-0 font-normal"
              onClick={onSwitchToLogin}
            >
              Sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
};

export default SignupForm;

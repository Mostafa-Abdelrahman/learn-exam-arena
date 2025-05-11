
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AuthService from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onForgotPassword: () => void;
}

const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await AuthService.login({
        email,
        password,
      });
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Get user data to determine role
      const user = await AuthService.getCurrentUser();
      
      // Redirect based on user role
      const userRole = user?.role;
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "doctor") {
        navigate("/doctor/dashboard");
      } else if (userRole === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to login. Please check your credentials.");
      toast({
        title: "Login failed",
        description: err.response?.data?.message || err.message || "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button 
          type="button" 
          variant="link" 
          className="p-0 h-auto text-sm" 
          onClick={onForgotPassword}
        >
          Forgot your password?
        </Button>
      </CardContent>
      
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;

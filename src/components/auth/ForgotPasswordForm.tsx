
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/services/auth.service";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await AuthService.forgotPassword({ email: resetEmail });
      setResetSent(true);
      toast({
        title: "Reset link sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to send reset email. Please try again.");
      toast({
        title: "Password reset failed",
        description: err.response?.data?.message || err.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {resetSent ? (
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertTitle>Check your email</AlertTitle>
            <AlertDescription>
              We've sent a password reset link to your email address.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </div>
        )}

        <Button 
          type="button" 
          variant="link" 
          className="p-0 h-auto text-sm"
          onClick={onBackToLogin}
        >
          Back to login
        </Button>
      </CardContent>
      
      <CardFooter>
        {!resetSent && (
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        )}
        {resetSent && (
          <Button type="button" className="w-full" onClick={onBackToLogin}>
            Return to login
          </Button>
        )}
      </CardFooter>
    </form>
  );
};

export default ForgotPasswordForm;

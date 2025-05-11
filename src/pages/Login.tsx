
import { useState } from "react";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleForgotPassword = () => {
    setActiveTab("forgot");
  };

  const handleBackToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Exam Arena</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your account
          </p>
        </div>

        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot">Forgot</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm onForgotPassword={handleForgotPassword} />
            </TabsContent>

            <TabsContent value="register">
              <SignupForm onSuccess={handleBackToLogin} />
            </TabsContent>

            <TabsContent value="forgot">
              <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;

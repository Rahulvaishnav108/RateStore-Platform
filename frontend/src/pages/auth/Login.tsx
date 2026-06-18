import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FiMail, FiStar, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormField } from "@/components/forms/FormField";
import { PasswordField } from "@/components/forms/PasswordField";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validations";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Login() {
  const { user, login, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Redirect if already logged in
  if (user) {
    const redirects = {
      admin: '/admin',
      user: '/user', 
      store_owner: '/owner'
    };
    return <Navigate to={redirects[user.role as keyof typeof redirects] || '/'} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error: any) {
      // Handle specific field errors
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          setError(err.field as keyof LoginFormData, {
            message: err.message
          });
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md space-y-8"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        {/* Logo and title */}
        <motion.div 
          className="text-center space-y-4"
          variants={fadeInUp}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg"
          >
            <FiStar className="text-3xl text-primary-foreground" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your RateStore account
            </p>
          </div>
        </motion.div>

        {/* Login form */}
        <motion.div variants={fadeInUp}>
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  startIcon={<FiMail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <PasswordField
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  {...register("password")}
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-11" 
                  loading={isLoggingIn}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign in
                      <FiArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link 
                    to="/register" 
                    className="text-primary font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        {/* Demo credentials */}
        <motion.div 
          variants={fadeInUp}
          className="text-center"
        >
          <Card className="bg-muted/50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Demo Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-2 text-xs">
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-background rounded-lg p-2 text-left">
                  <div className="font-medium">Admin</div>
                  <div className="text-muted-foreground">admin@storerating.com</div>
                  <div className="text-muted-foreground">Admin@123</div>
                </div>
                <div className="bg-background rounded-lg p-2 text-left">
                  <div className="font-medium">User</div>
                  <div className="text-muted-foreground">ankit@gmail.com</div>
                  <div className="text-muted-foreground">User@1234</div>
                </div>
                <div className="bg-background rounded-lg p-2 text-left">
                  <div className="font-medium">Store Owner</div>
                  <div className="text-muted-foreground">rajesh.owner@gmail.com</div>
                  <div className="text-muted-foreground">Owner@123</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

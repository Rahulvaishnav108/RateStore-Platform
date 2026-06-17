import * as React from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FiMail, FiStar, FiUser, FiMapPin, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormField } from "@/components/forms/FormField";
import { PasswordField } from "@/components/forms/PasswordField";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { VALIDATION } from "@/config/constants";

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

export default function Register() {
  const { user, register: registerUser, isRegistering } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: ""
    }
  });

  const nameValue = watch("name");
  const addressValue = watch("address");

  // Redirect if already logged in
  if (user) {
    const redirects = {
      admin: '/admin',
      user: '/user', 
      store_owner: '/owner'
    };
    return <Navigate to={redirects[user.role as keyof typeof redirects] || '/'} replace />;
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
    } catch (error: any) {
      // Handle specific field errors
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          setError(err.field as keyof RegisterFormData, {
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
            <h1 className="text-3xl font-bold text-foreground">Join RateStore</h1>
            <p className="text-muted-foreground">
              Create your account to start rating stores
            </p>
          </div>
        </motion.div>

        {/* Registration form */}
        <motion.div variants={fadeInUp}>
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  label="Full Name"
                  placeholder="Enter your full name (minimum 20 characters)"
                  startIcon={<FiUser className="h-4 w-4" />}
                  error={errors.name?.message}
                  showCharCount
                  maxLength={VALIDATION.NAME_MAX}
                  value={nameValue}
                  hint={nameValue?.length < VALIDATION.NAME_MIN ? `${VALIDATION.NAME_MIN - (nameValue?.length || 0)} more characters needed` : undefined}
                  {...register("name")}
                />

                <FormField
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  startIcon={<FiMail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <PasswordField
                  label="Password"
                  placeholder="Create a strong password"
                  error={errors.password?.message}
                  showStrength
                  showToggle
                  {...register("password")}
                />

                <FormField
                  label="Address"
                  placeholder="Enter your address (optional)"
                  startIcon={<FiMapPin className="h-4 w-4" />}
                  error={errors.address?.message}
                  showCharCount
                  maxLength={VALIDATION.ADDRESS_MAX}
                  value={addressValue}
                  {...register("address")}
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-11" 
                  loading={isRegistering}
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link 
                    to="/login" 
                    className="text-primary font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
                  >
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        {/* Requirements */}
        <motion.div 
          variants={fadeInUp}
          className="text-center"
        >
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Name must be at least {VALIDATION.NAME_MIN} characters</p>
                <p>• Password must be 8-16 characters with uppercase & special character</p>
                <p>• All fields except address are required</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
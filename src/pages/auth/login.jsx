import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CommonForm from '@/components/common/form';
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";


const initialState = {
  email: '',
  password: ''
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

 
  async function onSubmit(event) {
    event.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        toast({
          title: resultAction.payload.message,
          variant: "success",
        });
        navigate('/shop/home');
      } else if (loginUser.rejected.match(resultAction)) {
        toast({
          title: resultAction.payload?.message || 'An Error occurred. Please recheck email and password',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }
  

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthLogin;
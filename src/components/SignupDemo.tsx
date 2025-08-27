import { AuthModern } from "@/components/ui/auth-modern";
import { useNavigate } from "react-router-dom";

const SignupDemo = () => {
  const navigate = useNavigate();
  
  return (
    <AuthModern 
      onSuccess={() => navigate('/dashboard')}
    />
  );
};

export { SignupDemo }; 
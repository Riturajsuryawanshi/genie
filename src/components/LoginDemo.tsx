import { AuthModern } from "@/components/ui/auth-modern";
import { useNavigate } from "react-router-dom";

const LoginDemo = () => {
  const navigate = useNavigate();
  
  return (
    <AuthModern 
      onSuccess={() => navigate('/dashboard')}
    />
  );
};

export { LoginDemo }; 
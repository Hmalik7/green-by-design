import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import "./login.css";


const Register = ({ onRegistered }: { onRegistered?: () => void }) => {

    const [form, setForm] = useState({
        user_persona: "Product Manager", // Default value
        first_name: "",
        last_name: "",
        company_name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        //Validate password match
        if (form.password !== form.confirmPassword) {
            toast({ title: "Passwords do not match", variant: "destructive" });
            return;
        }

        // Basic validation
        if (form.password.length < 6) {
            toast({ title: "Password too short", description: "Password must be at least 6 characters", variant: "destructive" });
            return;
        }

        setLoading(true);


         try {
            // Use the register function from auth context
            const success = await register({
                user_persona: form.user_persona,
                first_name: form.first_name,
                last_name: form.last_name,
                company_name: form.company_name,
                email: form.email,
                username: form.username,
                password: form.password,
                confirmPassword: form.confirmPassword
            });

            if (success) {
                toast({
                    title: "Registration successful",
                    description: "You can now log in with your credentials."
                });

                // Reset form
                setForm({
                    user_persona: "Product Manager",
                    first_name: "",
                    last_name: "",
                    company_name: "",
                    email: "",
                    username: "",
                    password: "",
                    confirmPassword: "",

                });

                if (onRegistered) onRegistered();
                navigate("/login");
            } else {
                toast({
                    title: "Registration failed",
                    description: "Please check your information and try again",
                    variant: "destructive"
                });
            }

        } catch (error) {
            console.error('Registration error:', error);
            toast({
                title: "Network error",
                description: "Please check your connection and try again",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-heading">Register</h1>
                <p className="input-label">Create a new account</p>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="userPersona" className="input-label">User Persona</label>
                        <select
                            id="userPersona"
                            className="input-field w-full"
                            value={form.user_persona}
                            onChange={e => setForm({ ...form, user_persona: e.target.value })}
                            required
                        >
                            <option>Product Manager</option>
                            <option>Developer</option>
                            <option>Financial Analyst</option>
                            <option>Sustainability Officer</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="firstName" className="input-label">First Name</label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            value={form.first_name}
                            onChange={e => setForm({ ...form, first_name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="input-label">Last Name</label>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            value={form.last_name}
                            onChange={e => setForm({ ...form, last_name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="companyName" className="input-label">Company Name</label>
                        <Input
                            id="companyName"
                            type="text"
                            placeholder="Enter your company name"
                            value={form.company_name}
                            onChange={e => setForm({ ...form, company_name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="input-label">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="input-label">Username</label>
                        <Input
                            id="username"
                            placeholder="Enter your username"
                            type="text"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="input-label">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </form>
            </div>
        </div>
    );
};


export default Register;
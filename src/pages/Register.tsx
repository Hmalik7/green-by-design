import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import "./login.css";

const Register = ({ onRegistered }: { onRegistered?: () => void }) => {
    const [form, setForm] = useState({
        fullName: "",
        companyName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        userPersona: "Product Manager" // Default value
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast({ title: "Passwords do not match", variant: "destructive" });
            return;
        }
        setLoading(true);
        // Supabase sign up with email and password
        //Supabase fields:fullName(can be split into first and last name), email, username, password, userType
        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    full_name: form.fullName, // Add full name to metadata
                    username: form.username, // Add username to metadata
                    user_persona: form.userPersona // Add user type to metadata
                }
            }
        });
        setLoading(false);
        // Error handling
        if (error) {
            toast({ title: "Registration failed", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Registration successful", description: "You can now log in." });
            setForm({ fullName: "", companyName: "", email: "", username: "", password: "", confirmPassword: "", userPersona: "Product Manager" });
            if (onRegistered) onRegistered();
            navigate("/login");
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
                            value={form.userPersona}
                            onChange={e => setForm({ ...form, userPersona: e.target.value })}
                            required
                        >
                            <option>Product Manager</option>
                            <option>Developer</option>
                            <option>Financial Analyst</option>
                            <option>Sustainability Officer</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="fullName" className="input-label">Full Name</label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={form.fullName}
                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="companyName" className="input-label">Company Name</label>
                        <Input
                            id="companyName"
                            type="text"
                            placeholder="Enter your company name"
                            value={form.companyName}
                            onChange={e => setForm({ ...form, companyName: e.target.value })}
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
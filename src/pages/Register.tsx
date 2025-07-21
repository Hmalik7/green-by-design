import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import "./login.css";

const Register = ({ onRegistered }: { onRegistered?: () => void }) => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast({ title: "Passwords do not match", variant: "destructive" });
            return;
        }
        setLoading(true);
        // Supabase sign up with email and password
        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    full_name: form.fullName,
                    username: form.username
                }
            }
        });
        setLoading(false);
        // Error handling
        if (error) {
            toast({ title: "Registration failed", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Registration successful", description: "You can now log in." });
            setForm({ fullName: "", email: "", username: "", password: "", confirmPassword: "" });
            if (onRegistered) onRegistered();
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-heading">Register</h1>
                <p className="login-description">Create a new account</p>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="fullName" className="input-label">Full Name</label>
                        <Input
                            id="fullName"
                            type="text"
                            value={form.fullName}
                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="input-label">Email</label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="input-label">Username</label>
                        <Input
                            id="username"
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
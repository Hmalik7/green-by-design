import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Register = ({ onRegistered }: { onRegistered?: () => void }) => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // You can use Supabase Auth or your own API here
        const { error } = await supabase.auth.signUp({
            email: form.username,
            password: form.password,
        });
        setLoading(false);
        if (error) {
            toast({ title: "Registration failed", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Registration successful", description: "You can now log in." });
            setForm({ username: "", password: "" });
            if (onRegistered) onRegistered();
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted/30">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <Label htmlFor="username">Username (Email)</Label>
                            <Input
                                id="username"
                                type="email"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
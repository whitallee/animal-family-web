import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { useLogin } from "@/lib/auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserDrawer() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const loginMutation = useLogin();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginMutation.mutateAsync({ email, password });
            // Close the drawer on successful login
            const closeButton = document.querySelector('[data-drawer-close]');
            if (closeButton instanceof HTMLElement) {
                closeButton.click();
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Drawer>
            <DrawerTrigger><UserIcon className="w-6 h-6 text-stone-500" /></DrawerTrigger>
            <DrawerContent className="bg-stone-700 text-stone-50">
                <DrawerHeader>
                    <DrawerTitle className="text-stone-50">User Profile</DrawerTitle>
                    <DrawerDescription className="text-stone-400">You are not logged in.</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleLogin} className="px-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-stone-50">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-stone-600 border-stone-500 text-stone-50"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-stone-50">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-stone-600 border-stone-500 text-stone-50"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="w-full text-stone-50"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                </form>
                <DrawerFooter className="max-w-md min-w-[20rem] sm:min-w-[24rem] mx-auto">
                    <Button className="text-stone-50">Signup</Button>
                    <DrawerClose>
                        <Button variant="outline" className="text-stone-800">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
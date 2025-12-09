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
import { useLogin, useRegister } from "@/lib/auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

export default function UserDrawer() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [open, setOpen] = useState(false);
    const { isLoggedIn, user, login, logout } = useAuth();
    const loginMutation = useLogin();
    const registerMutation = useRegister();

    // useEffect(() => {
    //     if (isLoggedIn) {
    //         setEmail("");
    //         setPassword("");
    //         setOpen(false);
    //     } else {
    //         setEmail("");
    //         setPassword("");
    //         setOpen(true);
    //     }
    // }, [isLoggedIn]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await loginMutation.mutateAsync({ email, password });
            if (data.token && data.user) {
                login(data.token, data.user);
                setEmail("");
                setPassword("");
                setOpen(false);
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerMutation.mutateAsync({ firstName, lastName, email, password });
            // After successful signup, switch to login mode
            setIsSignupMode(false);
            setFirstName("");
            setLastName("");
            setPassword("");
            // Keep email filled in for convenience
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="relative">
                    <UserIcon className={`w-6 h-6 text-stone-500`} />
                    {!isLoggedIn ? <UserIcon className={`w-6 h-6 text-stone-500 absolute top-0 animate-ping`} /> : null}
                </div>
            </DrawerTrigger>
            <DrawerContent className="bg-stone-700 text-stone-50">
                <DrawerHeader>
                    <DrawerTitle className="text-stone-50">User Profile</DrawerTitle>
                    <DrawerDescription className="text-stone-400">{isLoggedIn ? `Logged in as ${user?.email}` : "You are not logged in."}</DrawerDescription>
                </DrawerHeader>
                {isLoggedIn ?
                <div className="px-4 flex flex-col gap-2">
                    <p>First Name: {user?.firstName}</p>
                    <p>Last Name: {user?.lastName}</p>
                    <p>Email: {user?.email}</p>
                    <p>Phone: {"Not provided"}</p>
                    <Button className="mt-4" onClick={() => {logout(); setEmail(""); setPassword(""); setOpen(false);}}>Logout</Button>
                </div> 
                : <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="px-4 space-y-4">
                    {isSignupMode && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-stone-50">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="bg-stone-600 border-stone-500 text-stone-50"
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-stone-50">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="bg-stone-600 border-stone-500 text-stone-50"
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>
                        </>
                    )}
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
                        disabled={isSignupMode ? registerMutation.isPending : loginMutation.isPending}
                    >
                        {isSignupMode 
                            ? (registerMutation.isPending ? "Creating account..." : "Signup")
                            : (loginMutation.isPending ? "Logging in..." : "Login")
                        }
                    </Button>
                    <Button 
                        type="button"
                        variant="outline"
                        className="text-stone-50 bg-stone-600 w-full"
                        onClick={() => {
                            setIsSignupMode(!isSignupMode);
                            setFirstName("");
                            setLastName("");
                            setPassword("");
                        }}
                    >
                        {isSignupMode ? "Login instead" : "Signup instead"}
                    </Button>
                </form>}
                <DrawerFooter className="max-w-md min-w-[20rem] sm:min-w-[24rem] mx-auto">
                    <DrawerClose asChild>
                        <Button variant="outline" className="text-stone-800">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
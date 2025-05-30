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

export default function UserDrawer() {
    return (
        <Drawer>
            <DrawerTrigger><UserIcon className="w-6 h-6 text-stone-500" /></DrawerTrigger>
            <DrawerContent className="bg-stone-700 text-stone-50">
                <DrawerHeader>
                    <DrawerTitle className="text-stone-50">User Profile</DrawerTitle>
                    <DrawerDescription className="text-stone-400">You are not logged in.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="max-w-md min-w-[20rem] sm:min-w-[24rem] mx-auto">
                    <Button className="text-stone-50">Login</Button>
                    <Button className="text-stone-50">Signup</Button>
                    <DrawerClose>
                        <Button variant="outline" className="text-stone-800">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
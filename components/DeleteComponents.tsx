"use client";

import { Flower2, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useDeleteTask } from "@/lib/api/task-mutations";
import { useDeleteAnimal, useMemorializeAnimal } from "@/lib/api/animal-mutations";
import { useDeleteEnclosure, useDeleteEnclosureWithAnimals } from "@/lib/api/enclosure-mutations";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteTaskButton({ taskId }: { taskId: number }) {
    const [open, setOpen] = useState(false);
    const deleteTask = useDeleteTask();

    const handleDelete = async () => {
        try {
            await deleteTask.mutateAsync(taskId);
            setOpen(false);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex-1 text-red-200">
                    <TrashIcon />
                    Delete Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this task? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteTask.isPending}
                    >
                        {deleteTask.isPending ? "Deleting..." : "Delete"}
                    </Button>
                    <Button
                        variant="outline"
                        className="text-stone-800"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function DeleteAnimalButton({ animalId }: { animalId: number }) {
    const [open, setOpen] = useState(false);
    const [memorialOpen, setMemorialOpen] = useState(false);
    const [memorialMessage, setMemorialMessage] = useState("");
    const deleteAnimal = useDeleteAnimal();
    const memorializeAnimal = useMemorializeAnimal();

    const handleDelete = async () => {
        try {
            await deleteAnimal.mutateAsync(animalId);
            setOpen(false);
        } catch (error) {
            console.error("Error deleting animal:", error);
        }
    };

    const handleMemorialize = async () => {
        try {
            await memorializeAnimal.mutateAsync({
                animalId,
                lastMessage: memorialMessage.trim()
            });
            setMemorialOpen(false);
            setOpen(false);
            setMemorialMessage("");
            toast.success("Animal memorialized. You can view your memorialized animals in the user tab.");
        } catch (error) {
            console.error("Error memorializing animal:", error);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="flex-1 text-red-200">
                        <TrashIcon />
                        Delete Animal
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Animal</DialogTitle>
                        <DialogDescription className="text-stone-400">
                            What would you like to do with this enclosure?
                            <br/>
                            <span className="text-red-200">
                                Deleting an animal will delete all tasks associated with it.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1 text-stone-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setMemorialOpen(true)}
                            className="flex-1 bg-emerald-400"
                        >
                            Memorialize <Flower2 />
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteAnimal.isPending}
                            className="flex-1 bg-red-700 mt-6"
                        >
                            {deleteAnimal.isPending ? "Deleting..." : "Delete Animal (and tasks)"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={memorialOpen} onOpenChange={setMemorialOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Memorialize Animal</DialogTitle>
                        <DialogDescription className="text-stone-400">
                            Add a memorial message for this animal.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Enter memorial message..."
                            value={memorialMessage}
                            onChange={(e) => setMemorialMessage(e.target.value)}
                            className="min-h-32"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setMemorialOpen(false);
                                setMemorialMessage("");
                            }}
                            className="text-stone-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleMemorialize}
                            disabled={memorializeAnimal.isPending || !memorialMessage.trim()}
                            className="bg-emerald-400"
                        >
                            {memorializeAnimal.isPending ? "Memorializing..." : "Memorialize"} <Flower2 />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function DeleteEnclosureButton({ enclosureId }: { enclosureId: number }) {
    const [open, setOpen] = useState(false);
    const deleteEnclosure = useDeleteEnclosure();
    const deleteEnclosureWithAnimals = useDeleteEnclosureWithAnimals();

    const handleDelete = async () => {
        try {
            await deleteEnclosure.mutateAsync(enclosureId);
            setOpen(false);
        } catch (error) {
            console.error("Error deleting enclosure:", error);
        }
    };

    const handleDeleteWithAnimals = async () => {
        try {
            await deleteEnclosureWithAnimals.mutateAsync(enclosureId);
            setOpen(false);
        } catch (error) {
            console.error("Error deleting enclosure with animals:", error);
        }
    };

    const isPending = deleteEnclosure.isPending || deleteEnclosureWithAnimals.isPending;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex-1 text-red-200">
                    <TrashIcon />
                    Delete Enclosure
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Enclosure</DialogTitle>
                    <DialogDescription className="text-stone-400">
                        What would you like to do with this enclosure?
                        <br/>
                        <span className="text-red-200">
                            Deleting an enclosure or its animals will delete all tasks associated with it.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 text-stone-800"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1 bg-red-700"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete Enclosure (and tasks)"}
                    </Button>
                    <div className="text-red-200 w-full text-center mt-4 mb-[-4px] text-sm">Caution!</div>
                    <Button
                        variant="destructive"
                        className="flex-1 bg-red-700"
                        onClick={handleDeleteWithAnimals}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete Animals and Enclosure (and tasks)"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
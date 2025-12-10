"use client"

import { useState } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Task } from "@/types/db-types";
import { useUpdateTask } from "@/lib/api/task-mutations";

interface EditTaskButtonProps {
    task: Task;
}

export function EditTaskButton({ task }: EditTaskButtonProps) {
    const [open, setOpen] = useState(false);
    const [taskName, setTaskName] = useState(task.taskName);
    const [taskDesc, setTaskDesc] = useState(task.taskDesc);
    const [repeatIntervHours, setRepeatIntervHours] = useState(task.repeatIntervHours.toString());
    const [complete, setComplete] = useState(task.complete);
    const updateTask = useUpdateTask();

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            // Reset form fields when dialog opens
            setTaskName(task.taskName);
            setTaskDesc(task.taskDesc);
            setRepeatIntervHours(task.repeatIntervHours.toString());
            setComplete(task.complete);
        }
    };

    const handleSave = () => {
        updateTask.mutate({
            taskId: task.taskId,
            taskName,
            taskDesc,
            complete,
            lastCompleted: task.lastCompleted,
            repeatIntervHours: parseInt(repeatIntervHours, 10)
        }, {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PencilIcon />
                Edit Task
            </Button>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="bg-stone-700 text-stone-50 border-stone-600">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>
                            Update the task details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="taskName">Task Name</Label>
                            <Input
                                id="taskName"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="taskDesc">Description</Label>
                            <Textarea
                                id="taskDesc"
                                value={taskDesc}
                                onChange={(e) => setTaskDesc(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="repeatIntervHours">Repeat Interval (hours)</Label>
                            <Input
                                id="repeatIntervHours"
                                type="number"
                                value={repeatIntervHours}
                                onChange={(e) => setRepeatIntervHours(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="complete"
                                checked={complete}
                                onChange={(e) => setComplete(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="complete">Complete</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="text-stone-800" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSave}
                            disabled={updateTask.isPending}
                        >
                            {updateTask.isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function DeleteTaskButton() {
    return (
        <Button disabled>
            <TrashIcon />
            Delete Task
        </Button>
    );
}
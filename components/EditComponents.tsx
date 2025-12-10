"use client"

import { useState } from "react";
import { PencilIcon, TrashIcon, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

interface EditTaskButtonProps {
    task: Task;
}

// Helper function to convert hours to the best unit representation
function convertHoursToUnit(hours: number): { amount: number; unit: string } {
    if (hours % (24 * 365) === 0) {
        return { amount: hours / (24 * 365), unit: "years" };
    } else if (hours % (24 * 30) === 0) {
        return { amount: hours / (24 * 30), unit: "months" };
    } else if (hours % (24 * 7) === 0) {
        return { amount: hours / (24 * 7), unit: "weeks" };
    } else if (hours % 24 === 0) {
        return { amount: hours / 24, unit: "days" };
    } else {
        return { amount: hours, unit: "hours" };
    }
}

export function EditTaskButton({ task }: EditTaskButtonProps) {
    const initialUnit = convertHoursToUnit(task.repeatIntervHours);
    const [open, setOpen] = useState(false);
    const [taskName, setTaskName] = useState(task.taskName);
    const [taskDesc, setTaskDesc] = useState(task.taskDesc);
    const [repeatIntervUnitAmt, setRepeatIntervUnitAmt] = useState(initialUnit.amount);
    const [repeatIntervUnitType, setRepeatIntervUnitType] = useState(initialUnit.unit);
    const [complete, setComplete] = useState(task.complete);
    const [lastCompleted, setLastCompleted] = useState(task.lastCompleted || "");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const updateTask = useUpdateTask();

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            // Reset form fields when dialog opens
            const unit = convertHoursToUnit(task.repeatIntervHours);
            setTaskName(task.taskName);
            setTaskDesc(task.taskDesc);
            setRepeatIntervUnitAmt(unit.amount);
            setRepeatIntervUnitType(unit.unit);
            setComplete(task.complete);
            setLastCompleted(task.lastCompleted || "");
        }
    };

    const handleSave = () => {
        // Validate required fields
        const invalidFields: string[] = [];
        
        if (!taskName.trim()) {
            invalidFields.push("Task Name");
        }
        if (!taskDesc.trim()) {
            invalidFields.push("Description");
        }
        if (!repeatIntervUnitAmt || repeatIntervUnitAmt <= 0) {
            invalidFields.push("Repeat Interval");
        }

        if (invalidFields.length > 0) {
            toast.error(`Please fill in the following fields: ${invalidFields.join(", ")}`);
            return;
        }

        // Convert unit and amount to hours
        let repeatIntervHours = 0;
        if (repeatIntervUnitType === "hours") {
            repeatIntervHours = repeatIntervUnitAmt;
        } else if (repeatIntervUnitType === "days") {
            repeatIntervHours = repeatIntervUnitAmt * 24;
        } else if (repeatIntervUnitType === "weeks") {
            repeatIntervHours = repeatIntervUnitAmt * 24 * 7;
        } else if (repeatIntervUnitType === "months") {
            repeatIntervHours = repeatIntervUnitAmt * 24 * 30;
        } else if (repeatIntervUnitType === "years") {
            repeatIntervHours = repeatIntervUnitAmt * 24 * 365;
        }

        updateTask.mutate({
            taskId: task.taskId,
            taskName: taskName.trim(),
            taskDesc: taskDesc.trim(),
            complete,
            lastCompleted: lastCompleted,
            repeatIntervHours: repeatIntervHours
        }, {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };

    return (
        <>
            <Button className="flex-1" onClick={() => setOpen(true)}>
                <PencilIcon />
                Edit Task
            </Button>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent>
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
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="taskDesc">Description</Label>
                            <Textarea
                                id="taskDesc"
                                value={taskDesc}
                                onChange={(e) => setTaskDesc(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="repeatIntervHours">Repeat Interval</Label>
                            <div className="flex flex-row gap-2 items-start">
                                <div className="flex text-stone-400 text-center items-center h-full">Every</div>
                                <Input
                                    id="repeatIntervHours"
                                    type="number"
                                    min={1}
                                    value={repeatIntervUnitAmt}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatIntervUnitAmt(parseInt(e.target.value) || 0)}
                                    className="w-[5ch] text-right"
                                    required
                                />
                                <select 
                                    id="repeatIntervUnitType"
                                    value={repeatIntervUnitType}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRepeatIntervUnitType(e.target.value)}
                                    className="bg-stone-700 border border-input rounded-md px-3 py-1 h-9"
                                >
                                    <option value="hours">hours</option>
                                    <option value="days">days</option>
                                    <option value="weeks">weeks</option>
                                    <option value="months">months</option>
                                    <option value="years">years</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lastCompleted">Last Completed</Label>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="lastCompleted"
                                        className="w-full justify-between font-normal bg-stone-600 border-stone-500 text-stone-50 overflow-hidden"
                                    >
                                        {lastCompleted ? format(new Date(lastCompleted), "PPP") : "Select date"}
                                        <CalendarIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0 bg-stone-600 border-stone-500 text-stone-50 min-h-[336px]" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={lastCompleted ? new Date(lastCompleted) : undefined}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setLastCompleted(date?.toISOString() || "")
                                            setCalendarOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
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
        <Button className="flex-1" disabled>
            <TrashIcon />
            Delete Task
        </Button>
    );
}
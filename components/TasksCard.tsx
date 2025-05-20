import { Check, Circle, Square, SquareDashed } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tasks = [
    {
        taskId: 1,
        taskName: "Feed the dog",
        taskDesc: "1/2 cup of dog food twice a day",
        complete: false,
        lastCompleted: new Date(),
        repeatIntervHours: 12,
    },
    {
        taskId: 2,
        taskName: "Water change on betta tank",
        taskDesc: "25% water change, stormy likes to swim near the siphon tube",
        complete: false,
        lastCompleted: new Date(),
        repeatIntervHours: 12,
    },
    {
        taskId: 3,
        taskName: "Feed crickets to chameleon",
        taskDesc: "3-5 crickets every 3 days",
        complete: false,
        lastCompleted: new Date(),
        repeatIntervHours: 12,
    },
    {
        taskId: 4,
        taskName: "Clean the ferret cage",
        taskDesc: "Remove waste, clean the cage, and add fresh bedding",
        complete: true,
        lastCompleted: new Date(),
        repeatIntervHours: 12,
    },
]

function TaskItem({ task }: { task: Task }) {
    return (
            <div className="flex items-center gap-2">
                <Button className="w-6 h-6 p-0">
                     {task.complete ? <Check /> : <></>}
                </Button>
                <h3>{task.taskName}</h3>
                {/* <p>{task.taskDesc}</p> */}
            </div>
    )
}

export default function TasksCard() {
    return (
        <Card className="w-full max-w-md p-4 flex flex-col gap-3 bg-stone-700 text-stone-50 shadow-lg border-stone-600 ">
            {tasks.map((task) => (
                <TaskItem key={task.taskId} task={task} />
            ))}
        </Card>
    )
}
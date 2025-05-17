import { Check, Circle, Square, SquareDashed } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tasks = [
    {
        id: 1,
        title: "Feed the dog",
        description: "1/2 cup of dog food twice a day",
        completed: false,
    },
    {
        id: 2,
        title: "Water change on betta tank",
        description: "25% water change, stormy likes to swim near the siphon tube",
        completed: false,
    },
    {
        id: 3,
        title: "Feed crickets to chameleon",
        description: "3-5 crickets every 3 days",
        completed: false,
    },
    {
        id: 4,
        title: "Clean the ferret cage",
        description: "Remove waste, clean the cage, and add fresh bedding",
        completed: true,
    },
]

function TaskItem({ task }: { task: Task }) {
    return (
            <div className="flex items-center gap-2">
                <Button className="w-6 h-6 p-0">
                     {task.completed ? <Check /> : <></>}
                </Button>
                <h3>{task.title}</h3>
                {/* <p>{task.description}</p> */}
            </div>
    )
}

export default function TasksCard() {
    return (
        <Card className="w-full max-w-md p-4 flex flex-col gap-3 bg-stone-700 text-stone-50 shadow-lg border-stone-600 ">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </Card>
    )
}
import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";

export function DeleteTaskButton() {
    return (
        <Button className="flex-1" disabled>
            <TrashIcon />
            Delete Task
        </Button>
    );
}

export function DeleteAnimalButton() {
    return (
        <Button className="flex-1" disabled>
            <TrashIcon />
            Delete Animal
        </Button>
    );
}

export function DeleteEnclosureButton() {
    return (
        <Button className="flex-1" disabled>
            <TrashIcon />
            Delete Enclosure
        </Button>
    );
}
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";

interface DroppableColumnProps {
    id: string;
    title: string;
    count: number;
    children: React.ReactNode;
}

export function DroppableColumn({ id, title, count, children }: DroppableColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: id });

    return (
        <div className="flex flex-col bg-neutral-200/50 rounded-xl w-80 flex-shrink-0 max-h-full">
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-700">{title}</h3>
                <span className="text-xs font-medium text-neutral-500 bg-neutral-200 px-2 py-1 rounded-full">
                    {count}
                </span>
            </div>

            {/* Drop Zone */}
            <div 
                ref={setNodeRef}
                className={`flex-1 overflow-y-auto p-2 space-y-3 transition-colors ${
                    isOver ? "bg-blue-50/50 rounded-lg" : ""
                }`}
            >
                {children}
            </div>

            {/* Add Ticket Button */}
            <div className="p-3">
                <button className="flex items-center gap-2 text-sm text-neutral-500 font-medium
                hover:text-neutral-800 hover:bg-neutral-200 w-full p-2 rounded-md transition-colors">
                    <Plus className="w-4 h-4" /> Add Ticket
                </button>
            </div>
        </div>
    );
}
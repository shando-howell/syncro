import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal } from "lucide-react";

interface TicketProps {
    ticket: {
        id: string;
        title: string;
        status: string;
        priority: string;
    };
}

export function DraggableTicket({ ticket }: TicketProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: ticket.id,
        data: { status: ticket.status }
    });

    // Apply the CSS transform while dragging
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-white p-4 rounded-lg shadow-sm border border-neutral-200 cursor-grab active:cursor-grabbing
                hover:border-blue-300 transition-colors group relative ${isDragging ? "opacity-50 z-50 ring-2 ring-blue-500 shadow-xl" : ""

            }`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                    ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                    ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                }`}>
                    {ticket.priority}
                </span>
                <button 
                    className="text-neutral-400 hover:text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
            <p className="text-sm font-medium text-neutral-800 leading-snug">
                {ticket.title}
            </p>
        </div>
    );
}
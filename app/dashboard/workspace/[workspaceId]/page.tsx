"use client"

import { useState } from "react";
import { Navbar } from "@/app/components/Navbar";
import { DroppableColumn } from "@/app/components/kanban/DroppableColumn";
import { DraggableTicket } from "@/app/components/kanban/DraggableTicket";
import { MoreHorizontal, Plus } from "lucide-react";
import {
    DndContext,
    DragEndEvent,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

// Temporary tickets
const COLUMNS = ["To Do", "In Progress", "In Review", "Done"];
const MOCK_TICKETS = [
    { id: "1", title: "Design database schema", status: "Done", priority: "High" },
    { id: "2", title: "Setup Clerk Webhook", status: "Done", priority: "High" },
    { id: "3", title: "Build Kanban UI shell", status: "In Progress", priority: "Medium" },
    { id: "4", title: "Implement Drag and Drop", status: "To Do", priority: "High" },
    { id: "5", title: "Add collaborative cursors", status: "To Do", priority: "Low" },
];

export default function WorkspacePage({ params }: { params: { workspaceId: string }}) {
    const [tickets, setTickets] = useState(MOCK_TICKETS);

    // Sensors configuration
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Must drag 5px before it registers
            },
        }),
        useSensor(KeyboardSensor)
    );

    // The central nervous system for drag actions
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return; // Dropped outside a valid area

        const ticketId = active.id as string;
        const newStatus = over.id as string;

        // Optimistic UI updtae
        setTickets((currentTickets) => 
            currentTickets.map((ticket) => 
                ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
            )
        );

        // TODO: RFire the Convex mutation here to sync with the database
        // updateTicketStatus({ ticketId, newSTatus });
    }

    return (
        <div className="flex flex-col h-screen bg-neutral-100 overflow-hidden">
            <Navbar workspaceId={params.workspaceId} />

            {/* Kanban Board Area */}
            <main className="flex-1 overflow-x-auto p-2">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                >

                    <div className="flex gap-6 h-full items-start">
                        {COLUMNS.map((col) => {
                            const columnTickets = tickets.filter((t) => t.status === col);

                            return (
                                <DroppableColumn
                                    key={col}
                                    id={col}
                                    title={col}
                                    count={columnTickets.length}
                                >
                                    {columnTickets.map((ticket) => (
                                        <DraggableTicket key={ticket.id} ticket={ticket} />
                                    ))}
                                </DroppableColumn>
                            )
                        
                        })}
                    </div>
                </DndContext>
            </main>
        </div>
    )
}
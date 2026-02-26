import React from "react";
import { ContactList } from "./ContactList";
import { ChatWindow } from "./ChatWindow";

export function CommunicationDashboardView() {
  return (
    <div className="h-[calc(100vh-120px)] flex bg-card rounded-2xl border shadow-xl overflow-hidden backdrop-blur-sm bg-card/50">
      <ContactList />
      <ChatWindow />
    </div>
  );
}

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  BarChart, 
  Settings, 
  TrendingUp,
  Home,
  Calendar,
  CreditCard,
  Mic,
  DollarSign
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const clientSidebarItems = [
  { title: "Dashboard", icon: Home, badge: null, path: "/dashboard", color: "bg-blue-500" },
  { title: "Bulk SMS", icon: Phone, badge: "New", path: "/bulk-sms", color: "bg-blue-500" },
  { title: "Bulk Email", icon: Mail, badge: null, path: "/bulk-email", color: "bg-green-500" },
  { title: "WhatsApp", icon: MessageSquare, badge: "Pro", path: "/whatsapp", color: "bg-emerald-500" },
  { title: "USSD", icon: Phone, badge: null, path: "/ussd", color: "bg-orange-500" },
  { title: "Voice Calls", icon: Mic, badge: null, path: "/voice", color: "bg-purple-500" },
  { title: "Airtime", icon: CreditCard, badge: null, path: "/airtime", color: "bg-green-600" },
  { title: "Short Codes", icon: Phone, badge: null, path: "/short-codes", color: "bg-purple-500" },
  { title: "Surveys", icon: BarChart, badge: null, path: "/surveys", color: "bg-indigo-500" },
  { title: "M-Pesa", icon: DollarSign, badge: "Beta", path: "/mpesa", color: "bg-yellow-500" },
  { title: "Campaigns", icon: Calendar, badge: null, path: "/campaigns", color: "bg-pink-500" },
  { title: "Billing", icon: TrendingUp, badge: null, path: "/billing", color: "bg-violet-500" },
  { title: "Account Settings", icon: Settings, badge: null, path: "/settings", color: "bg-gray-500" },
];

export function ClientSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="border-r-0 shadow-xl">
      <SidebarHeader className="p-6 border-b bg-blue-50/70 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mobiwave
            </h2>
            <p className="text-sm text-muted-foreground font-medium">Communication Platform</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4 bg-blue-50/30 backdrop-blur-sm">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-3">
            Services
          </p>
        </div>
        
        <SidebarMenu className="space-y-2">
          {clientSidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  className="w-full justify-between group hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                >
                  <div 
                    className="flex items-center justify-between w-full cursor-pointer p-3 rounded-xl"
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant={item.badge === "New" ? "default" : item.badge === "Pro" ? "secondary" : "outline"} 
                        className={`text-xs ${
                          item.badge === "New" ? "bg-green-500" : 
                          item.badge === "Pro" ? "bg-purple-500 text-white" : 
                          "bg-orange-500 text-white"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

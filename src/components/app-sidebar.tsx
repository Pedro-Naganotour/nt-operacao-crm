import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  Factory,
  Stamp,
  KanbanSquare,
  FileText,
  DollarSign,
  AlertTriangle,
  Plane,
  Receipt,
  HeartHandshake,
  Bell,
  LogOut,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const groups: Array<{
  label: string;
  items: Array<{ title: string; url: string; icon: React.ComponentType<{ className?: string }> }>;
}> = [
  {
    label: "Visão geral",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Alertas", url: "/alertas", icon: Bell },
    ],
  },
  {
    label: "Pessoas",
    items: [
      { title: "Passageiros", url: "/passageiros", icon: Users },
    ],
  },
  {
    label: "Kanbans",
    items: [
      { title: "Comercial", url: "/kanban/comercial", icon: KanbanSquare },
      { title: "Documentação", url: "/kanban/documentacao", icon: KanbanSquare },
      { title: "COE / Visto", url: "/kanban/coe-visto", icon: KanbanSquare },
      { title: "Embarque", url: "/kanban/embarque", icon: KanbanSquare },
    ],
  },
  {
    label: "Operação",
    items: [
      { title: "Vagas", url: "/vagas", icon: Briefcase },
      { title: "Empreiteiras", url: "/empreiteiras", icon: Building2 },
      { title: "Fábricas", url: "/fabricas", icon: Factory },
      { title: "Despachantes", url: "/despachantes", icon: Stamp },
      { title: "Documentos", url: "/documentos", icon: FileText },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { title: "Custos", url: "/financeiro", icon: DollarSign },
      { title: "Dívidas / Risco", url: "/dividas", icon: AlertTriangle },
      { title: "Passagens", url: "/passagens", icon: Plane },
      { title: "Faturas", url: "/faturas", icon: Receipt },
    ],
  },
  {
    label: "Pós-venda",
    items: [
      { title: "Acompanhamento", url: "/pos-venda", icon: HeartHandshake },
    ],
  },
  {
    label: "Administração",
    items: [
      { title: "Equipe / Permissões", url: "/equipe", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useLocation().pathname;
  const { signOut, user } = useAuth();

  const isActive = (url: string) => (url === "/" ? currentPath === "/" : currentPath.startsWith(url));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-bold">
            NT
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-sidebar-foreground">NT Operação</span>
              <span className="text-[11px] text-sidebar-foreground/60">Nagano Tour CRM</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {!collapsed && user && (
          <div className="px-2 pb-2 text-xs text-sidebar-foreground/70 truncate">{user.email}</div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

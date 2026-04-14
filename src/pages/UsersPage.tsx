import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users as UsersIcon, Shield, Mic, Ticket } from 'lucide-react';

const roleIcons: Record<string, typeof Shield> = {
  admin: Shield,
  organizer: Mic,
  participant: Ticket,
};

const roleColors: Record<string, string> = {
  admin: 'bg-destructive/10 text-destructive',
  organizer: 'bg-primary/10 text-primary',
  participant: 'bg-muted text-muted-foreground',
};

const UsersPage = () => {
  const { data: profiles } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const { data: userRoles } = useQuery({
    queryKey: ['all-user-roles'],
    queryFn: async () => {
      const { data } = await supabase.from('user_roles').select('*');
      return data || [];
    },
  });

  const getRoleForUser = (userId: string) => {
    const ur = userRoles?.find(r => r.user_id === userId);
    return ur?.role || 'unknown';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Users</h1>
        <Badge variant="secondary" className="text-sm">{profiles?.length || 0} total</Badge>
      </div>
      <div className="space-y-3">
        {profiles?.map(p => {
          const role = getRoleForUser(p.user_id);
          const RoleIcon = roleIcons[role] || UsersIcon;
          return (
            <Card key={p.id} className="glass">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {(p.full_name || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{p.full_name || 'Unnamed'}</p>
                  <p className="text-xs text-muted-foreground">{p.phone || 'No phone'}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${roleColors[role] || ''}`}>
                  <RoleIcon className="w-3 h-3" />
                  {role}
                </span>
              </CardContent>
            </Card>
          );
        })}
        {profiles?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <UsersIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No users yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;

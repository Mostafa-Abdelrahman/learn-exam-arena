
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentNotificationsListProps {
  recentNotifications: any[];
}

const RecentNotificationsList = ({ recentNotifications }: RecentNotificationsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {recentNotifications.length > 0 ? (
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No recent notifications</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentNotificationsList;

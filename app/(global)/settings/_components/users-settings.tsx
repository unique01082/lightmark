'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function UsersSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Current User</h5>
                <p className="text-sm text-muted-foreground">Administrator</p>
              </div>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h5 className="font-medium">Team Members</h5>
                <p className="text-sm text-muted-foreground">Invite and manage team access</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>Configure access levels and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">Data Access</h5>
              <p className="text-sm text-muted-foreground mb-3">
                Control who can view and edit data
              </p>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">File Access</h5>
              <p className="text-sm text-muted-foreground mb-3">
                Manage file upload and download permissions
              </p>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Database, Code, GitBranch, FileCode, Menu } from 'lucide-react';
import { DATABASE_SCHEMA } from '../types/database';
import { API_STRUCTURE } from '../types/api';
import { ROLES_CONFIG } from '../types/roles';
import { Button } from './ui/button';

interface SystemDocumentationProps {
  onMenuClick?: () => void;
}

export function SystemDocumentation({ onMenuClick }: SystemDocumentationProps) {
  const techStack = [
    {
      category: 'Frontend',
      items: [
        { name: 'React 18.3', description: 'UI library with hooks and modern features' },
        { name: 'TypeScript', description: 'Type-safe JavaScript' },
        { name: 'Tailwind CSS v4', description: 'Utility-first CSS framework' },
        { name: 'React Router', description: 'Client-side routing' },
        { name: 'Recharts', description: 'Chart and data visualization' },
        { name: 'Lucide React', description: 'Icon library' },
      ]
    },
    {
      category: 'Backend (Recommended)',
      items: [
        { name: 'Node.js + Express', description: 'RESTful API server' },
        { name: 'PostgreSQL', description: 'Relational database' },
        { name: 'Prisma/TypeORM', description: 'ORM for database operations' },
        { name: 'JWT', description: 'Authentication tokens' },
        { name: 'Redis', description: 'Caching and session management' },
      ]
    },
    {
      category: 'Alternative Stack (Laravel)',
      items: [
        { name: 'Laravel 11', description: 'PHP framework for backend' },
        { name: 'MySQL/PostgreSQL', description: 'Database' },
        { name: 'Laravel Sanctum', description: 'API authentication' },
        { name: 'Laravel Queue', description: 'Job processing' },
        { name: 'Laravel Telescope', description: 'Debugging and monitoring' },
      ]
    },
    {
      category: 'DevOps & Infrastructure',
      items: [
        { name: 'Docker', description: 'Containerization' },
        { name: 'AWS/Azure', description: 'Cloud hosting' },
        { name: 'GitHub Actions', description: 'CI/CD pipeline' },
        { name: 'Nginx', description: 'Web server and reverse proxy' },
        { name: 'CloudFlare', description: 'CDN and DDoS protection' },
      ]
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">System Documentation</h1>
              <p className="text-sm text-muted-foreground">Complete technical reference and architecture</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Tabs defaultValue="database" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="database">Database Schema</TabsTrigger>
            <TabsTrigger value="api">API Structure</TabsTrigger>
            <TabsTrigger value="roles">Role Matrix</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <CardTitle>Database Schema</CardTitle>
                </div>
                <CardDescription>
                  Complete database structure with {DATABASE_SCHEMA.tables.length} tables
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {DATABASE_SCHEMA.tables.map((table) => (
                  <div key={table.name} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{table.name}</h3>
                        <p className="text-sm text-muted-foreground">{table.description}</p>
                      </div>
                      <Badge variant="outline">{table.columns.length} columns</Badge>
                    </div>
                    <div className="space-y-2">
                      {table.columns.map((column) => (
                        <div key={column.name} className="flex items-center gap-4 text-sm py-2 border-b border-border last:border-0">
                          <div className="flex-1 font-mono text-blue-600 dark:text-blue-400">
                            {column.name}
                            {column.primaryKey && (
                              <Badge className="ml-2 text-xs bg-purple-500/10 text-purple-700">PK</Badge>
                            )}
                            {column.foreignKey && (
                              <Badge className="ml-2 text-xs bg-orange-500/10 text-orange-700">FK</Badge>
                            )}
                          </div>
                          <div className="flex-1 text-muted-foreground">{column.type}</div>
                          <div className="w-24">
                            {column.nullable ? (
                              <Badge variant="outline" className="text-xs">Nullable</Badge>
                            ) : (
                              <Badge className="text-xs bg-red-500/10 text-red-700">Required</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {table.relationships && table.relationships.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-sm font-medium mb-2">Relationships:</div>
                        <div className="flex flex-wrap gap-2">
                          {table.relationships.map((rel, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <GitBranch className="h-3 w-3 mr-1" />
                              {rel.type} → {rel.table}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <CardTitle>API Structure</CardTitle>
                </div>
                <CardDescription>
                  RESTful API endpoints organized by module
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {API_STRUCTURE.map((module) => (
                  <div key={module.name} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{module.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{module.baseUrl}</p>
                      </div>
                      <Badge variant="outline">{module.endpoints.length} endpoints</Badge>
                    </div>
                    <div className="space-y-3">
                      {module.endpoints.map((endpoint, idx) => (
                        <div key={idx} className="border border-border rounded-lg p-3">
                          <div className="flex items-start gap-3 mb-2">
                            <Badge className={
                              endpoint.method === 'GET' ? 'bg-blue-500' :
                              endpoint.method === 'POST' ? 'bg-green-500' :
                              endpoint.method === 'PUT' || endpoint.method === 'PATCH' ? 'bg-orange-500' :
                              'bg-red-500'
                            }>
                              {endpoint.method}
                            </Badge>
                            <div className="flex-1">
                              <div className="font-mono text-sm">{endpoint.path}</div>
                              <div className="text-sm text-muted-foreground">{endpoint.description}</div>
                            </div>
                            {endpoint.auth && (
                              <Badge variant="outline" className="text-xs">
                                <FileCode className="h-3 w-3 mr-1" />
                                Auth Required
                              </Badge>
                            )}
                          </div>
                          {endpoint.roles && endpoint.roles.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-2">
                              <span className="font-medium">Roles:</span> {endpoint.roles.join(', ')}
                            </div>
                          )}
                          {endpoint.response && (
                            <div className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">Response:</span> <code className="bg-muted px-1 py-0.5 rounded">{endpoint.response}</code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role-Permission Matrix</CardTitle>
                <CardDescription>
                  Comprehensive access control matrix for all {ROLES_CONFIG.length} system roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-semibold">Role</th>
                        <th className="text-left p-3 font-semibold">Description</th>
                        <th className="text-left p-3 font-semibold">Modules & Permissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ROLES_CONFIG.map((role) => (
                        <tr key={role.id} className="border-b border-border">
                          <td className="p-3">
                            <Badge className={role.color + ' text-white'}>
                              {role.name}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {role.description}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-2">
                              {role.permissions.map((perm, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  <strong>{perm.module}:</strong> {perm.actions.join(', ')}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Tech Stack</CardTitle>
                <CardDescription>
                  Modern, scalable technology stack for enterprise deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {techStack.map((category) => (
                  <div key={category.category} className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4">{category.category}</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {category.items.map((item) => (
                        <div key={item.name} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                          <div className="p-2 bg-primary/10 rounded">
                            <FileCode className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment Architecture</CardTitle>
                <CardDescription>Recommended deployment configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Production Environment</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Frontend: Static hosting on CloudFlare Pages / Vercel / Netlify</li>
                      <li>• Backend: Docker containers on AWS ECS / Azure Container Apps</li>
                      <li>• Database: Managed PostgreSQL (AWS RDS / Azure Database)</li>
                      <li>• File Storage: AWS S3 / Azure Blob Storage</li>
                      <li>• CDN: CloudFlare for global content delivery</li>
                      <li>• Monitoring: DataDog / New Relic / Sentry</li>
                    </ul>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Security Best Practices</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• SSL/TLS encryption for all communications</li>
                      <li>• JWT tokens with short expiration times</li>
                      <li>• Role-based access control (RBAC) enforcement</li>
                      <li>• Input validation and sanitization</li>
                      <li>• SQL injection prevention via ORM</li>
                      <li>• Rate limiting and DDoS protection</li>
                      <li>• Regular security audits and penetration testing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
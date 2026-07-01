import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserRole } from '../types/roles';
import { Package } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface SignupPageProps {
  onSignup: (role: UserRole) => void;
}

export function SignupPage({ onSignup }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName: name, role }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        if (resData.data.status === 'pending') {
          setSuccessMessage(resData.message || 'Registration successful! Your account is pending approval by the Admin. You will be able to log in once approved.');
          toast.success('Registration successful! Pending admin approval.');
          return;
        }
        localStorage.setItem('token', resData.data.token);
        localStorage.setItem('userRole', resData.data.role);
        onSignup(resData.data.role);
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        setError(resData.error || 'Failed to create account.');
        toast.error(resData.error || 'Failed to create account.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Something went wrong. Please check if the backend server is running.');
      toast.error('Something went wrong. Server might be down.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md"
        >
        <Card className="w-full shadow-2xl bg-white/60 dark:bg-black/60 backdrop-blur-xl border-white/20 dark:border-white/10 border-t-4 border-t-green-500">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="h-14 w-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
              <Package className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">Registration Successful</CardTitle>
            <CardDescription className="text-center font-medium mt-2">
              Your account has been created and is now pending administrator approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              {successMessage}
            </p>
            <div className="p-3 text-xs bg-accent/50 rounded-md text-left text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground mb-1">Account Details:</div>
              <div><strong>Name:</strong> {name}</div>
              <div><strong>Email:</strong> {email}</div>
              <div><strong>Role:</strong> {role}</div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button onClick={() => navigate('/login')} className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all bg-green-500 hover:bg-green-600 text-white">
              Back to Login
            </Button>
          </CardFooter>
        </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
      <Card className="w-full shadow-2xl bg-white/60 dark:bg-black/60 backdrop-blur-xl border-white/20 dark:border-white/10">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="h-14 w-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Package className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Create an Account</CardTitle>
          <CardDescription className="text-center font-medium">Enter your details to register for an account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-md text-center font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Choose Your Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Standard User</SelectItem>
                  <SelectItem value="super_user">Super User (Admin)</SelectItem>
                  <SelectItem value="inventory_admin">Inventory Admin</SelectItem>
                  <SelectItem value="order_processor">Order Processor</SelectItem>
                  <SelectItem value="delivery_person">Delivery Person</SelectItem>
                  <SelectItem value="accounting">Accounting</SelectItem>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
                  <SelectItem value="finance_contracts">Finance Contracts</SelectItem>
                  <SelectItem value="procurement">Procurement</SelectItem>
                  <SelectItem value="it_administrator">IT Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r from-primary to-secondary text-white border-0" disabled={submitting}>
              {submitting ? 'Registering...' : 'Create Account'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-secondary hover:underline font-bold transition-colors">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      </motion.div>
    </div>
  );
}

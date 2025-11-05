import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { recentTransactions } from '@/lib/data';

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>A list of the most recent sales and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>
                  <Badge variant={transaction.type === 'credit' ? 'default' : 'destructive'} className={transaction.type === 'credit' ? 'bg-blue-600' : ''}>
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-medium ${transaction.type === 'credit' ? 'text-blue-600' : 'text-red-600'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {transaction.amount.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


import React, { useState } from 'react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, History, DollarSign } from 'lucide-react';
import { useMspaceAirtime } from '@/hooks/useMspaceAirtime';
import { useToast } from '@/hooks/use-toast';

export function AirtimeService() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('');
  const [reference, setReference] = useState('');
  
  const { sendAirtime, getAirtimeHistory } = useMspaceAirtime();
  const { toast } = useToast();

  const handleSendAirtime = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !amount || !network) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendAirtime.mutateAsync({
        phone_number: phoneNumber,
        amount: parseFloat(amount),
        network: network as 'safaricom' | 'airtel' | 'telkom',
        reference: reference || undefined,
      });

      toast({
        title: "Airtime Sent",
        description: `KES ${amount} airtime sent to ${phoneNumber}`,
      });

      setPhoneNumber('');
      setAmount('');
      setNetwork('');
      setReference('');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send airtime",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Airtime Service</h1>
            <p className="text-gray-600">Send airtime to mobile numbers across Kenya</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send Airtime Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Send Airtime
              </CardTitle>
              <CardDescription>
                Transfer airtime to any mobile number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendAirtime} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="254700000000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network">Network Provider</Label>
                  <Select value={network} onValueChange={setNetwork}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safaricom">Safaricom</SelectItem>
                      <SelectItem value="airtel">Airtel</SelectItem>
                      <SelectItem value="telkom">Telkom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (KES)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="10"
                    min="10"
                    max="10000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">Minimum: KES 10, Maximum: KES 10,000</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Reference (optional)</Label>
                  <Input
                    id="reference"
                    placeholder="Gift for John"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={sendAirtime.isPending}
                  className="w-full"
                >
                  {sendAirtime.isPending ? 'Sending...' : 'Send Airtime'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Transaction History
              </CardTitle>
              <CardDescription>
                Recent airtime transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getAirtimeHistory.data?.length > 0 ? (
                <div className="space-y-3">
                  {getAirtimeHistory.data.map((transaction: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{transaction.phone_number}</span>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>KES {transaction.amount}</span>
                        <span>{transaction.network}</span>
                      </div>
                      {transaction.reference && (
                        <p className="text-sm text-gray-500 mt-1">{transaction.reference}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Sent</p>
                  <p className="text-2xl font-bold">KES 0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold">{getAirtimeHistory.data?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, UserPlus, UserMinus, Users } from 'lucide-react';

const GymCodeTracker = () => {
  // Define available codes
  const codes = ['Code A', 'Code B', 'Code C'];
  
  // Track usage for each code
  const [codeUsage, setCodeUsage] = useState(
    codes.reduce((acc, code) => ({
      ...acc,
      [code]: { user: null, endTime: null }
    }), {})
  );

  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedCode, setSelectedCode] = useState(codes[0]);

  const handleCheckIn = () => {
    if (name && duration) {
      const end = new Date();
      end.setMinutes(end.getMinutes() + parseInt(duration));
      setCodeUsage(prev => ({
        ...prev,
        [selectedCode]: {
          user: name,
          endTime: end
        }
      }));
      setName('');
      setDuration('');
    }
  };

  const handleCheckOut = (code) => {
    setCodeUsage(prev => ({
      ...prev,
      [code]: {
        user: null,
        endTime: null
      }
    }));
  };

  const isCodeAvailable = (code) => !codeUsage[code].user;

  const getAvailableCodesCount = () => {
    return Object.values(codeUsage).filter(usage => !usage.user).length;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Summary Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Gym Code Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-lg">
              <Users className="inline mr-2" />
              {getAvailableCodesCount()} of {codes.length} codes available
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Code Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {codes.map(code => (
          <Card key={code} className={isCodeAvailable(code) ? 'bg-white' : 'bg-blue-50'}>
            <CardHeader>
              <CardTitle className="text-xl">{code}</CardTitle>
            </CardHeader>
            <CardContent>
              {codeUsage[code].user ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold">
                      {codeUsage[code].user} is using this code
                    </p>
                    <p className="text-sm text-gray-600">
                      Until {codeUsage[code].endTime?.toLocaleTimeString()}
                    </p>
                  </div>
                  <Button 
                    className="w-full"
                    variant="destructive"
                    onClick={() => handleCheckOut(code)}
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Check Out
                  </Button>
                </div>
              ) : (
                <div className="text-green-600 font-medium">Available</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Check-in Form */}
      {getAvailableCodesCount() > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Check In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                >
                  {codes.filter(code => isCodeAvailable(code)).map(code => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <Button 
                className="w-full"
                onClick={handleCheckIn}
                disabled={!name || !duration}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Check In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GymCodeTracker;
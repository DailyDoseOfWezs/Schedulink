import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService, Lab } from '@/lib/supabaseService';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Monitor, CheckCircle, XCircle, Clock, Edit, Building2, Plus, User } from 'lucide-react';

const BUILDINGS = [
  'COMLAB BUILDING',
  'Main Building',
  'Library Building',
  'Other'
];

export default function LabMonitoring() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isUseLabOpen, setIsUseLabOpen] = useState(false);
  const [isEditLabOpen, setIsEditLabOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [section, setSection] = useState('');
  const [editingLabName, setEditingLabName] = useState('');
  const [editingBuilding, setEditingBuilding] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomBuilding, setNewRoomBuilding] = useState('COMLAB BUILDING');
  const [newBuildingName, setNewBuildingName] = useState('');
  const [buildings, setBuildings] = useState<string[]>(BUILDINGS);

  useEffect(() => {
    loadLabs();
    
    // Poll for updates every 2 seconds for real-time updates
    const interval = setInterval(loadLabs, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadLabs = async () => {
    try {
      const labsData = await supabaseService.getLabs();
      setLabs(labsData);
    } catch (error) {
      console.error('Error loading labs:', error);
    }
  };

  const handleUseLab = (lab: Lab) => {
    setSelectedLab(lab);
    setSection('');
    setIsUseLabOpen(true);
  };

  const handleSubmitUseLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLab) return;
    
    try {
      const timeIn = new Date().toISOString();
      await supabaseService.updateLab(selectedLab.id, {
        isAvailable: false,
        currentSection: section,
        teacherName: user?.name,
        occupant: user?.name,
        timeIn: timeIn,
        timeOut: undefined,
      });

      toast({
        title: 'Room marked as in use',
        description: `${selectedLab.name} is now occupied by ${section}`,
      });

      setSection('');
      setIsUseLabOpen(false);
      loadLabs();
    } catch (error) {
      console.error('Error updating lab:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room status',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAvailable = async (labId: string) => {
    try {
      const timeOut = new Date().toISOString();
      await supabaseService.updateLab(labId, {
        isAvailable: true,
        currentSection: undefined,
        teacherName: undefined,
        occupant: undefined,
        timeOut: timeOut,
      });

      toast({
        title: 'Room marked as available',
        description: 'The room is now free to use',
      });

      loadLabs();
    } catch (error) {
      console.error('Error marking lab available:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room status',
        variant: 'destructive',
      });
    }
  };

  const handleEditLab = (lab: Lab) => {
    setSelectedLab(lab);
    setEditingLabName(lab.name);
    setEditingBuilding(lab.building || 'COMLAB BUILDING');
    setIsEditLabOpen(true);
  };

  const handleSaveEditLab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLab) return;
    
    try {
      await supabaseService.updateLab(selectedLab.id, {
        name: editingLabName,
        building: editingBuilding,
      });

      toast({
        title: 'Room updated',
        description: 'Room information has been updated',
      });

      setIsEditLabOpen(false);
      loadLabs();
    } catch (error) {
      console.error('Error updating lab:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room information',
        variant: 'destructive',
      });
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const maxNumber = Math.max(...labs.map(l => l.number), 0);
      const qrCode = `${newRoomName.toUpperCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      await supabaseService.createLab({
        name: newRoomName,
        number: maxNumber + 1,
        qr_code: qrCode,
        building: newRoomBuilding,
      });

      toast({
        title: 'Room added',
        description: `${newRoomName} has been added to ${newRoomBuilding}`,
      });

      setNewRoomName('');
      setNewRoomBuilding('COMLAB BUILDING');
      setIsAddRoomOpen(false);
      loadLabs();
    } catch (error) {
      console.error('Error adding room:', error);
      toast({
        title: 'Error',
        description: 'Failed to add room',
        variant: 'destructive',
      });
    }
  };

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (buildings.includes(newBuildingName)) {
      toast({
        title: 'Building exists',
        description: 'This building already exists',
        variant: 'destructive',
      });
      return;
    }
    
    setBuildings([...buildings, newBuildingName]);
    setNewBuildingName('');
    setIsAddBuildingOpen(false);
    toast({
      title: 'Building added',
      description: `${newBuildingName} has been added`,
    });
  };

  // Group labs by building
  const labsByBuilding = labs.reduce((acc, lab) => {
    const building = lab.building || 'Other';
    if (!acc[building]) {
      acc[building] = [];
    }
    acc[building].push(lab);
    return acc;
  }, {} as Record<string, Lab[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Room Monitoring</h1>
            <p className="text-muted-foreground">Real-time status of rooms and laboratories</p>
          </div>
          {user?.role === 'teacher' && (
            <div className="flex gap-2">
              <Dialog open={isAddBuildingOpen} onOpenChange={setIsAddBuildingOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Add Building
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Building</DialogTitle>
                    <DialogDescription>Create a new building for organizing rooms</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddBuilding} className="space-y-4">
                    <div>
                      <Label htmlFor="buildingName">Building Name</Label>
                      <Input
                        id="buildingName"
                        value={newBuildingName}
                        onChange={(e) => setNewBuildingName(e.target.value)}
                        placeholder="e.g., Science Building"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Add Building</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Create a new room in a building</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddRoom} className="space-y-4">
                    <div>
                      <Label htmlFor="roomName">Room Name</Label>
                      <Input
                        id="roomName"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="e.g., Lab1, INFIRMARY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="roomBuilding">Building</Label>
                      <Select value={newRoomBuilding} onValueChange={setNewRoomBuilding}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {buildings.map(building => (
                            <SelectItem key={building} value={building}>{building}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">Add Room</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {Object.entries(labsByBuilding).map(([building, buildingLabs]) => (
          <div key={building} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <h2 className="text-2xl font-semibold">{building}</h2>
              <Badge variant="secondary">{buildingLabs.length} rooms</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buildingLabs.map(lab => (
                <Card key={lab.id} className={`transition-all ${
                  lab.isAvailable ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Monitor className={`h-5 w-5 ${lab.isAvailable ? 'text-green-600' : 'text-red-600'}`} />
                        <div className="flex-1">
                          <CardTitle className="text-lg">{lab.name}</CardTitle>
                          {user?.role === 'teacher' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 mt-1 text-xs"
                              onClick={() => handleEditLab(lab)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Name
                            </Button>
                          )}
                        </div>
                      </div>
                      <Badge variant={lab.isAvailable ? 'default' : 'destructive'} className="gap-1">
                        {lab.isAvailable ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Available
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            In Use
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!lab.isAvailable && (
                      <div className="space-y-2 bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Section:</span>
                          <span>{lab.currentSection}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4" />
                          <span className="font-medium">Occupant:</span>
                          <span>{lab.occupant || lab.teacherName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Teacher:</span>
                          <span>{lab.teacherName}</span>
                        </div>
                        {lab.timeIn && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-red-200">
                            <Clock className="h-3 w-3" />
                            <span>Time In: {new Date(lab.timeIn).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {lab.isAvailable && lab.timeOut && (
                      <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded">
                        Last Time Out: {new Date(lab.timeOut).toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last updated: {new Date(lab.lastUpdated).toLocaleTimeString()}
                    </div>
                    <div className="pt-2 border-t space-y-2">
                      {user?.role === 'teacher' && lab.isAvailable && (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleUseLab(lab)}
                        >
                          Use This Room
                        </Button>
                      )}
                      {user?.role === 'teacher' && !lab.isAvailable && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleMarkAvailable(lab.id)}
                        >
                          Mark as Available
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {labs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Monitor className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No rooms found</p>
              <p className="text-sm text-muted-foreground">Rooms will appear here once they are added to the system</p>
            </CardContent>
          </Card>
        )}

        <Dialog open={isUseLabOpen} onOpenChange={setIsUseLabOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Use Room - {selectedLab?.name}</DialogTitle>
              <DialogDescription>Enter your section/class information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitUseLab} className="space-y-4">
              <div>
                <Label htmlFor="section">Section/Class</Label>
                <Input
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g., CS-101, IT-201"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Mark as In Use</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditLabOpen} onOpenChange={setIsEditLabOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room - {selectedLab?.name}</DialogTitle>
              <DialogDescription>Update room name and building</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveEditLab} className="space-y-4">
              <div>
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  value={editingLabName}
                  onChange={(e) => setEditingLabName(e.target.value)}
                  placeholder="e.g., INFIRMARY, COMLAB, DEVCOM"
                  required
                />
              </div>
                    <div>
                      <Label htmlFor="building">Building</Label>
                      <Select value={editingBuilding} onValueChange={setEditingBuilding}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {buildings.map(building => (
                            <SelectItem key={building} value={building}>{building}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use Room Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">1</div>
              <div>
                <p className="font-medium">Teachers mark rooms as in use</p>
                <p className="text-muted-foreground">Click "Use This Room" and enter your section/class when starting to use a room.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">2</div>
              <div>
                <p className="font-medium">Real-time updates</p>
                <p className="text-muted-foreground">All users see room status updates immediately across all devices.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">3</div>
              <div>
                <p className="font-medium">Edit room names</p>
                <p className="text-muted-foreground">Teachers can edit room names and assign them to different buildings.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">4</div>
              <div>
                <p className="font-medium">Mark as available</p>
                <p className="text-muted-foreground">When done, teachers can mark the room as available for others.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

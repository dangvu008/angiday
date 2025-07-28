import React, { useState } from 'react';
import { FamilyMember } from '@/types/meal-planning';
import { CalorieCalculatorService } from '@/services/calorie-calculator.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, User, Calculator, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FamilyMemberManagerProps {
  familyMembers: FamilyMember[];
  onFamilyMembersChange: (members: FamilyMember[]) => void;
}

export const FamilyMemberManager: React.FC<FamilyMemberManagerProps> = ({
  familyMembers,
  onFamilyMembersChange
}) => {
  const { toast } = useToast();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    name: '',
    age: 25,
    gender: 'male',
    weight: 60,
    height: 170,
    activityLevel: 'moderate',
    isActive: true,
    dietaryRestrictions: [],
    allergies: []
  });

  const handleAddMember = () => {
    const errors = CalorieCalculatorService.validateFamilyMember(newMember);
    
    if (errors.length > 0) {
      toast({
        title: "Lỗi validation",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name!,
      age: newMember.age!,
      gender: newMember.gender!,
      weight: newMember.weight!,
      height: newMember.height!,
      activityLevel: newMember.activityLevel!,
      dailyCalorieNeeds: 0,
      nutritionGoals: {
        dailyCalories: 2000,
        protein: 20,
        carbs: 50,
        fat: 30,
        fiber: 25
      },
      dietaryRestrictions: [],
      allergies: [],
      isActive: true
    };

    const updatedMember = CalorieCalculatorService.updateMemberCalorieNeeds(member);
    const updatedMembers = [...familyMembers, updatedMember];
    
    onFamilyMembersChange(updatedMembers);
    setIsAddingMember(false);
    setNewMember({
      name: '',
      age: 25,
      gender: 'male',
      weight: 60,
      height: 170,
      activityLevel: 'moderate',
      isActive: true,
      dietaryRestrictions: [],
      allergies: []
    });

    toast({
      title: "Thành công",
      description: `Đã thêm thành viên ${updatedMember.name} (${updatedMember.dailyCalorieNeeds} calo/ngày)`
    });
  };

  const handleRemoveMember = (memberId: string) => {
    const member = familyMembers.find(m => m.id === memberId);
    const updatedMembers = familyMembers.filter(m => m.id !== memberId);
    onFamilyMembersChange(updatedMembers);
    
    toast({
      title: "Đã xóa",
      description: `Đã xóa thành viên ${member?.name}`
    });
  };

  const handleToggleActive = (memberId: string) => {
    const updatedMembers = familyMembers.map(member => 
      member.id === memberId 
        ? { ...member, isActive: !member.isActive }
        : member
    );
    onFamilyMembersChange(updatedMembers);
  };

  const totalFamilyCalories = CalorieCalculatorService.calculateFamilyTotalCalories(familyMembers);
  const activeMembers = familyMembers.filter(m => m.isActive);

  const activityLabels = {
    'sedentary': 'Ít vận động',
    'light': 'Vận động nhẹ',
    'moderate': 'Vận động vừa',
    'active': 'Vận động nhiều',
    'very-active': 'Vận động rất nhiều'
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tổng quan gia đình
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{familyMembers.length}</div>
              <div className="text-sm text-muted-foreground">Tổng thành viên</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeMembers.length}</div>
              <div className="text-sm text-muted-foreground">Đang hoạt động</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalFamilyCalories.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Tổng calo/ngày</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyMembers.map((member) => (
          <Card key={member.id} className={`${member.isActive ? 'border-green-200' : 'border-gray-200 opacity-60'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{member.name}</span>
                  {member.isActive && <Badge variant="secondary" className="bg-green-100 text-green-800">Hoạt động</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={member.isActive}
                    onCheckedChange={() => handleToggleActive(member.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tuổi:</span> {member.age}
                </div>
                <div>
                  <span className="text-muted-foreground">Giới tính:</span> {member.gender === 'male' ? 'Nam' : 'Nữ'}
                </div>
                <div>
                  <span className="text-muted-foreground">Cân nặng:</span> {member.weight}kg
                </div>
                <div>
                  <span className="text-muted-foreground">Chiều cao:</span> {member.height}cm
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4" />
                <span className="text-muted-foreground">Hoạt động:</span>
                <Badge variant="outline">{activityLabels[member.activityLevel]}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="text-lg font-semibold text-center">
                  {member.dailyCalorieNeeds.toLocaleString()} calo/ngày
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  BMR: {CalorieCalculatorService.calculateBMR(member).toFixed(0)} calo
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Member Card */}
        {isAddingMember ? (
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-lg">Thêm thành viên mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Tên</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="Nhập tên thành viên"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Tuổi</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newMember.age}
                    onChange={(e) => setNewMember({...newMember, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select value={newMember.gender} onValueChange={(value: 'male' | 'female') => setNewMember({...newMember, gender: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Cân nặng (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={newMember.weight}
                    onChange={(e) => setNewMember({...newMember, weight: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Chiều cao (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={newMember.height}
                    onChange={(e) => setNewMember({...newMember, height: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="activity">Mức độ hoạt động</Label>
                <Select value={newMember.activityLevel} onValueChange={(value: any) => setNewMember({...newMember, activityLevel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Ít vận động (văn phòng)</SelectItem>
                    <SelectItem value="light">Vận động nhẹ (1-3 ngày/tuần)</SelectItem>
                    <SelectItem value="moderate">Vận động vừa (3-5 ngày/tuần)</SelectItem>
                    <SelectItem value="active">Vận động nhiều (6-7 ngày/tuần)</SelectItem>
                    <SelectItem value="very-active">Vận động rất nhiều (2 lần/ngày)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddMember} className="flex-1">
                  Thêm thành viên
                </Button>
                <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 cursor-pointer hover:border-primary" onClick={() => setIsAddingMember(true)}>
            <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Plus className="h-8 w-8 mb-2" />
              <span>Thêm thành viên mới</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

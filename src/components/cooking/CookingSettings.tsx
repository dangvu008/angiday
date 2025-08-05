import React from 'react';
import { X, Volume2, VolumeX, Moon, Sun, Type, Smartphone, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCookingMode } from '@/contexts/CookingModeContext';

interface CookingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookingSettings: React.FC<CookingSettingsProps> = ({ isOpen, onClose }) => {
  const { state, updateSettings } = useCookingMode();
  const { settings, speechSynthesis } = state;

  if (!isOpen) return null;

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Cài đặt Chế độ Nấu ăn</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300 flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Hiển thị
            </h3>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm">
                Chế độ tối
              </Label>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
              />
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Cỡ chữ</Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value) => handleSettingChange('fontSize', value)}
              >
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="large">Lớn</SelectItem>
                  <SelectItem value="extra-large">Rất lớn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Keep Screen On */}
            <div className="flex items-center justify-between">
              <Label htmlFor="keep-screen-on" className="text-sm">
                Giữ màn hình sáng
              </Label>
              <Switch
                id="keep-screen-on"
                checked={settings.keepScreenOn}
                onCheckedChange={(checked) => handleSettingChange('keepScreenOn', checked)}
              />
            </div>

            {/* Layout */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Bố cục</Label>
              <Select
                value={settings.layout}
                onValueChange={(value) => handleSettingChange('layout', value)}
              >
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="mobile">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Di động
                    </div>
                  </SelectItem>
                  <SelectItem value="tablet">
                    <div className="flex items-center">
                      <Tablet className="h-4 w-4 mr-2" />
                      Máy tính bảng
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300 flex items-center">
              <Volume2 className="h-4 w-4 mr-2" />
              Giọng nói
            </h3>

            {/* Voice Enabled */}
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-enabled" className="text-sm">
                Bật đọc giọng nói
              </Label>
              <Switch
                id="voice-enabled"
                checked={settings.voiceEnabled}
                onCheckedChange={(checked) => handleSettingChange('voiceEnabled', checked)}
                disabled={!speechSynthesis.isSupported}
              />
            </div>

            {!speechSynthesis.isSupported && (
              <p className="text-xs text-yellow-400">
                Trình duyệt không hỗ trợ đọc giọng nói
              </p>
            )}

            {/* Voice Language */}
            {settings.voiceEnabled && speechSynthesis.isSupported && (
              <div className="flex items-center justify-between">
                <Label className="text-sm">Ngôn ngữ</Label>
                <Select
                  value={settings.voiceLanguage}
                  onValueChange={(value) => handleSettingChange('voiceLanguage', value)}
                >
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="vi-VN">Tiếng Việt</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Interaction Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Tương tác</h3>

            {/* Auto Advance Steps */}
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-advance" className="text-sm">
                Tự động chuyển bước
              </Label>
              <Switch
                id="auto-advance"
                checked={settings.autoAdvanceSteps}
                onCheckedChange={(checked) => handleSettingChange('autoAdvanceSteps', checked)}
              />
            </div>

            {/* Gesture Control */}
            <div className="flex items-center justify-between">
              <Label htmlFor="gesture-control" className="text-sm">
                Điều khiển cử chỉ
              </Label>
              <Switch
                id="gesture-control"
                checked={settings.gestureControlEnabled}
                onCheckedChange={(checked) => handleSettingChange('gestureControlEnabled', checked)}
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Thông báo</h3>

            {/* Timer Sounds */}
            <div className="flex items-center justify-between">
              <Label htmlFor="timer-sounds" className="text-sm">
                Âm thanh timer
              </Label>
              <Switch
                id="timer-sounds"
                checked={settings.timerSounds}
                onCheckedChange={(checked) => handleSettingChange('timerSounds', checked)}
              />
            </div>

            {/* Vibration Alerts */}
            <div className="flex items-center justify-between">
              <Label htmlFor="vibration-alerts" className="text-sm">
                Rung thông báo
              </Label>
              <Switch
                id="vibration-alerts"
                checked={settings.vibrationAlerts}
                onCheckedChange={(checked) => handleSettingChange('vibrationAlerts', checked)}
                disabled={!('vibrate' in navigator)}
              />
            </div>

            {!('vibrate' in navigator) && (
              <p className="text-xs text-yellow-400">
                Thiết bị không hỗ trợ rung
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              Lưu cài đặt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookingSettings;

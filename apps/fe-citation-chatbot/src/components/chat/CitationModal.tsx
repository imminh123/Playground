import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { MapPin, Calendar, DollarSign, Globe, Clock } from "lucide-react";
import type { Destination } from "../../types";

interface CitationModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CitationModal({ destination, isOpen, onClose }: CitationModalProps) {
  if (!destination) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            {destination.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1 text-gray-600">
            <Globe className="h-4 w-4" />
            {destination.country}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {destination.imageUrl && (
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <p className="text-gray-700 leading-relaxed">
            {destination.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              icon={<Calendar className="h-5 w-5 text-green-600" />}
              title="Best Time to Visit"
              value={destination.bestTime}
            />
            {destination.averageCost && (
              <InfoCard
                icon={<DollarSign className="h-5 w-5 text-amber-600" />}
                title="Average Cost"
                value={destination.averageCost}
              />
            )}
            {destination.language && (
              <InfoCard
                icon={<Globe className="h-5 w-5 text-purple-600" />}
                title="Language"
                value={destination.language}
              />
            )}
            {destination.currency && (
              <InfoCard
                icon={<Clock className="h-5 w-5 text-blue-600" />}
                title="Currency"
                value={destination.currency}
              />
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-lg">Highlights</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {destination.highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-sm text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

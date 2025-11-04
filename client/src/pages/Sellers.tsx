import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Mail, Phone, MessageCircle, Globe, ExternalLink } from "lucide-react";
import { SiDiscord } from "react-icons/si";

interface Seller {
  id: string;
  name: string;
  description: string;
  images: string[];
  prices: { item: string; price: number }[];
  email: string;
  phone: string;
  whatsapp: string;
  discord: string;
  website: string;
  featured: boolean;
  promotionText: string;
  averageRating: number;
  totalReviews: number;
}

export default function Sellers() {
  const { data: sellers = [], isLoading } = useQuery<Seller[]>({
    queryKey: ["/api/sellers"],
  });

  const featuredSellers = sellers.filter(s => s.featured);
  const regularSellers = sellers.filter(s => !s.featured);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const SellerCard = ({ seller }: { seller: Seller }) => (
    <Card className="hover-elevate" data-testid={`card-seller-${seller.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {seller.name}
              {seller.featured && (
                <Badge variant="default" className="text-xs" data-testid={`badge-featured-${seller.id}`}>
                  Featured
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2">{seller.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {seller.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {seller.images.slice(0, 4).map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`${seller.name} ${idx + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
        )}

        {seller.promotionText && (
          <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
            <p className="text-sm font-medium text-primary">{seller.promotionText}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          {renderStars(Math.round(seller.averageRating))}
          <span className="text-sm font-medium">
            {seller.averageRating.toFixed(1)} ({seller.totalReviews} reviews)
          </span>
        </div>

        {seller.prices.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm font-semibold">Sample Prices:</p>
            <div className="grid grid-cols-1 gap-1">
              {seller.prices.slice(0, 5).map((price, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm bg-muted/50 rounded px-2 py-1"
                >
                  <span className="text-muted-foreground">{price.item}</span>
                  <span className="font-semibold">${price.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2 border-t">
          <p className="text-sm font-semibold">Contact Information:</p>
          <div className="grid grid-cols-1 gap-2">
            {seller.email && (
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => window.open(`mailto:${seller.email}`, '_blank')}
                data-testid={`button-email-${seller.id}`}
              >
                <Mail className="h-4 w-4 mr-2" />
                {seller.email}
              </Button>
            )}
            {seller.phone && (
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => window.open(`tel:${seller.phone}`, '_blank')}
                data-testid={`button-phone-${seller.id}`}
              >
                <Phone className="h-4 w-4 mr-2" />
                {seller.phone}
              </Button>
            )}
            {seller.whatsapp && (
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => window.open(`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                data-testid={`button-whatsapp-${seller.id}`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            )}
            {seller.discord && (
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                data-testid={`button-discord-${seller.id}`}
              >
                <SiDiscord className="h-4 w-4 mr-2" />
                {seller.discord}
              </Button>
            )}
            {seller.website && (
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => window.open(seller.website.startsWith('http') ? seller.website : `https://${seller.website}`, '_blank')}
                data-testid={`button-website-${seller.id}`}
              >
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            )}
            {!seller.email && !seller.phone && !seller.whatsapp && !seller.discord && !seller.website && (
              <p className="text-sm text-muted-foreground">No contact information available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading sellers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Game Card Sellers</h1>
          <p className="text-lg text-muted-foreground">
            Find trusted sellers for CrossFire game cards and items
          </p>
        </div>

        {featuredSellers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Featured Sellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSellers.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>
          </div>
        )}

        {regularSellers.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {featuredSellers.length > 0 ? "All Sellers" : ""}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularSellers.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>
          </div>
        )}

        {sellers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No sellers available yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

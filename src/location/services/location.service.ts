import { Injectable } from '@nestjs/common';
import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocationService {
  private client: GoogleMapsClient;
  constructor(private readonly configService: ConfigService) {
    this.client = new GoogleMapsClient({});
  }

  async searchAddress(address: string) {
    try {
      const res = await this.client.textSearch({
        params: {
          query: address,
          key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
}

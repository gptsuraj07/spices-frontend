import { Component } from '@angular/core';

export interface SpiceOrigin {
  id: string;
  name: string;
  location: string;
  tamilName: string;
  icon: string;
  desc: string;
  benefit: string;
}

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  // Interactive Manifesto Tab State
  activeTab: 'pounding' | 'sourcing' | 'heritage' | 'freshness' = 'pounding';

  // Interactive Spice Origin Explorer State
  selectedOriginId = 'guntur';

  origins: SpiceOrigin[] = [
    {
      id: 'guntur',
      name: 'Guntur Sun-Dried Chillies',
      location: 'Guntur, Andhra Pradesh',
      tamilName: 'குண்டூர் மிளகாய்',
      icon: '🌶️',
      desc: 'Sun-dried under open skies to lock in natural deep red pigment without synthetic dyes.',
      benefit: 'Rich color & balanced warming heat',
    },
    {
      id: 'salem',
      name: 'Salem Coriander Seeds',
      location: 'Salem, Tamil Nadu',
      tamilName: 'சேலம் கொத்தமல்லி',
      icon: '🌿',
      desc: 'Plump, highly aromatic coriander seeds brimming with natural essential digestive oils.',
      benefit: 'Soothing aroma & digestive comfort',
    },
    {
      id: 'alleppey',
      name: 'Alleppey Turmeric Roots',
      location: 'Alleppey, Kerala',
      tamilName: 'ஆலப்புழை மஞ்சள்',
      icon: '🟡',
      desc: 'High-curcumin golden turmeric roots harvested at peak potency.',
      benefit: 'Potent immunity & natural golden hue',
    },
    {
      id: 'tellicherry',
      name: 'Tellicherry Black Pepper',
      location: 'Tellicherry, Kerala',
      tamilName: 'தலச்சேரி மிளகு',
      icon: '⚫',
      desc: 'Extra-large vine-ripened peppercorns known as the king of spices worldwide.',
      benefit: 'Intense warming heat & piperine richness',
    },
  ];

  selectTab(tab: 'pounding' | 'sourcing' | 'heritage' | 'freshness'): void {
    this.activeTab = tab;
  }

  selectOrigin(id: string): void {
    this.selectedOriginId = id;
  }

  get activeOrigin(): SpiceOrigin {
    return this.origins.find(o => o.id === this.selectedOriginId) || this.origins[0];
  }
}

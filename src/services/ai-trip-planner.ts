export type TripPlannerRequest = {
  destination: string;
  days: number;
  budget: string;
  interests: string[];
};

export async function generateTripPlan(_request: TripPlannerRequest) {
  return {
    status: 'coming-soon',
    message: 'AI trip planning will be connected here later.'
  };
}

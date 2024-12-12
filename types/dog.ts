export interface DogData {
  _id: string;
  userId: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  description?: string;
  imageUrl: string;
  createdAt: string;
} 
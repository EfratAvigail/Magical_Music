export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface Singer {
  id: number
  name: string
  biography?: string
  imageUrl?: string
  songs?: Song[]
}

export interface Song {
  id: number
  name: string
  musicStyle: string
  songLength: string
  releaseDate: string
  imageUrl?: string
  audioUrl?: string
  singerId?: number
  singerName?: string
  liked: boolean
}

export type User = {
  id: number
  name: string
  email: string
}
// export interface Singer {
//   id: number;
//   name: string;
//   songs?: Song[]; // שירים שקשורים לזמר
// }

// export interface Song {
//   id: number;
//   name: string;
//   musicStyle?: string; // יכול להיות null
//   songLength: string; // נניח שזה בפורמט של "HH:mm:ss"
//   releaseDate: string; // בפורמט תאריך
//   imageUrl?: string; // יכול להיות null
//   singerId: number; // מזהה הזמר
//   liked: boolean; // אם השיר אהוב
// }

// export type User = {
//   id: number;
//   name: string;
//   email?: string; // יכול להיות null
//   password?: string; // יכול להיות null
//   role?: string; // יכול להיות null
//   songs?: Song[]; // שירים שהמשתמש מחזיק
// }

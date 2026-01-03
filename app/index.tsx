
import { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Immediately redirect to waitlist sign-in
  return <Redirect href="/waitlist/sign-in" />;
}

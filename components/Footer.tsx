import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background shadow-md mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Kingdom Runners</h3>
            <p className="text-sm">Uniting runners globally through faith and fitness.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:text-primary">About Us</Link></li>
              <li><Link href="/events" className="text-sm hover:text-primary">Events</Link></li>
              <li><Link href="/prayer-wall" className="text-sm hover:text-primary">Prayer Wall</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-primary"><Facebook /></a>
              <a href="#" className="text-foreground hover:text-primary"><Twitter /></a>
              <a href="#" className="text-foreground hover:text-primary"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Kingdom Runners. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
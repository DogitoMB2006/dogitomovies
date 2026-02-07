import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlQuery = searchParams.get('q') ?? '';

    useEffect(() => {
        if (urlQuery !== searchQuery) setSearchQuery(urlQuery);
    }, [urlQuery]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'TV Shows', path: '/tv' },
        { name: 'Movies', path: '/movies' },
        { name: 'New & Popular', path: '/new' },
    ];

    return (
        <nav
            className={cn(
                'fixed top-0 w-full z-50 transition-colors duration-300',
                isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
            )}
        >
            <div className="container mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-8">
                    <Link to="/" className="text-xl sm:text-2xl font-bold text-primary font-heading">
                        DogitoMovies
                    </Link>
                    <div className="hidden md:flex gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="hidden md:flex items-center bg-secondary/50 rounded-full px-3 py-1.5 border border-transparent focus-within:border-gray-500 transition-colors">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Titles, people, genres"
                            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-48 text-white placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <button className="text-white hover:text-gray-300 transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold">
                            DM
                        </div>
                    </div>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

          
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-t border-gray-800"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-gray-300 hover:text-white text-lg font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <form onSubmit={handleSearch} className="flex items-center bg-secondary rounded-full px-4 py-2 mt-2">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none focus:outline-none text-base ml-2 w-full text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

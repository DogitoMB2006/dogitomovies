import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
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
                'fixed inset-x-0 top-0 z-50 border-b-0 transition-all duration-300',
                isScrolled
                    ? 'bg-background/88 backdrop-blur-xl'
                    : 'bg-gradient-to-b from-black/55 via-black/20 to-transparent'
            )}
        >
            <div className="content-wrap w-full py-3 md:py-4">
                <div
                    className={cn(
                        'soft-glow flex w-full min-w-0 flex-shrink-0 flex-nowrap items-center justify-between gap-3 rounded-2xl px-3 py-2 sm:px-4 md:px-5 transition-colors',
                        isScrolled ? 'frosted border border-border/80 bg-card/75 backdrop-blur-xl' : 'border border-transparent bg-black/25 backdrop-blur-md'
                    )}
                >
                    <div className="flex min-w-0 flex-shrink items-center gap-4 md:gap-8">
                            <Link to="/" className="text-lg font-extrabold tracking-tight text-primary sm:text-xl">
                                DogitoMovies
                            </Link>
                            <div className="hidden items-center gap-5 md:flex">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.name}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            cn(
                                                'text-sm font-semibold transition-colors',
                                                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                                            )
                                        }
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
                            <form
                                onSubmit={handleSearch}
                                className="hidden items-center rounded-xl border border-border/80 bg-secondary/85 px-3 py-2 md:flex"
                            >
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search titles"
                                    className="ml-2 w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground lg:w-52"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>

                            <button
                                type="button"
                                className="rounded-lg border border-border/60 bg-secondary/80 p-2 text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Notifications"
                            >
                                <Bell className="h-4 w-4" />
                            </button>

                            <div className="grid h-8 w-8 place-content-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-700 text-xs font-bold text-white">
                                DM
                            </div>

                            <button
                                className="rounded-lg border border-border/60 bg-secondary/80 p-2 text-foreground md:hidden"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle navigation"
                            >
                                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="content-wrap pb-3 md:hidden"
                    >
                        <div className="frosted rounded-2xl p-4">
                            <div className="mb-4 flex flex-col gap-3">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.name}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            cn(
                                                'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                                                isActive
                                                    ? 'bg-primary/20 text-foreground'
                                                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                                            )
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}
                            </div>

                            <form onSubmit={handleSearch} className="flex items-center rounded-xl border border-border/80 bg-secondary/85 px-3 py-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search titles"
                                    className="ml-2 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
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

/**
 * Globe Nest Solutions
 * Animation Script File
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // GSAP Animation Setup
    
    // Register the ScrollTrigger plugin
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Hero section animations
    if (typeof gsap !== 'undefined') {
        const heroTl = gsap.timeline();
        
        heroTl.from('.hero h1', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from('.hero p', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-cta .btn', {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 0.5,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.hero-shape', {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.7');

        // Section title animations
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Service cards stagger animation
        gsap.from('.service-card', {
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
                trigger: '.services',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });

        // Portfolio items animation
        gsap.utils.toArray('.portfolio-item').forEach(item => {
            gsap.from(item, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Country cards staggered animation
        gsap.from('.country-card', {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.7,
            scrollTrigger: {
                trigger: '.team',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });

        // Process steps animation
        gsap.from('.process-step', {
            opacity: 0,
            x: -30,
            stagger: 0.2,
            duration: 0.7,
            scrollTrigger: {
                trigger: '.process',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });

        // Testimonial items animation
        gsap.from('.testimonial-item', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.testimonials',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });

        // Contact section elements animation
        const contactTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });

        contactTl.from('.contact h2', {
            opacity: 0,
            y: 30,
            duration: 0.6
        })
        .from('.contact-info-item', {
            opacity: 0,
            x: -30,
            stagger: 0.2,
            duration: 0.5
        }, '-=0.3')
        .from('.contact-form', {
            opacity: 0,
            y: 30,
            duration: 0.6
        }, '-=0.4');

        // Text reveal animation for paragraphs
        gsap.utils.toArray('.text-reveal').forEach(text => {
            gsap.from(text, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                scrollTrigger: {
                    trigger: text,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Footer animation
        const footerTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });

        footerTl.from('.footer-logo', {
            opacity: 0,
            y: 20,
            duration: 0.6
        })
        .from('.footer h5', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5
        }, '-=0.3')
        .from('.footer-links li', {
            opacity: 0,
            x: -20,
            stagger: 0.05,
            duration: 0.4
        }, '-=0.2')
        .from('.footer-social a', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.3
        }, '-=0.2')
        .from('.footer-bottom', {
            opacity: 0,
            y: 20,
            duration: 0.5
        }, '-=0.1');
    }

    // Create the globe animation in the hero section
    if (document.getElementById('globe-animation') && typeof THREE !== 'undefined') {
        const canvas = document.getElementById('globe-animation');
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        
        // Create the globe using three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Create globe
        const radius = 5;
        const segments = 64;
        const globeGeometry = new THREE.SphereGeometry(radius, segments, segments);
        
        // Create material with custom shader for glowing effect
        const globeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);
        
        // Add points on the globe
        const pointsCount = 200;
        const points = new THREE.Group();
        
        for (let i = 0; i < pointsCount; i++) {
            const point = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: i % 2 === 0 ? 0xfff44f : 0xff8c1a
                })
            );
            
            // Random position on sphere
            const phi = Math.acos(-1 + Math.random() * 2);
            const theta = Math.random() * Math.PI * 2;
            
            point.position.x = radius * Math.sin(phi) * Math.cos(theta);
            point.position.y = radius * Math.sin(phi) * Math.sin(theta);
            point.position.z = radius * Math.cos(phi);
            
            points.add(point);
        }
        
        scene.add(points);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(radius * 1.2, segments, segments);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8c1a,
            transparent: true,
            opacity: 0.1
        });
        
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glowMesh);
        
        // Position camera
        camera.position.z = 12;
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            globe.rotation.y += 0.002;
            points.rotation.y += 0.002;
            glowMesh.rotation.y += 0.002;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            const newWidth = canvas.offsetWidth;
            const newHeight = canvas.offsetHeight;
            
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            
            renderer.setSize(newWidth, newHeight);
        });
    }
});
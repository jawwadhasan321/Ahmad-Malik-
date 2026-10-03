import math

width = 2400
height = 2400

lines = []

# Generate perfectly X-tiling wavy lines
for base_y in range(-400, height + 400, 40): # tighter spacing
    points = []
    
    # Each line has a unique but smooth noise profile
    # Using the base_y to seed the phase
    phase1 = base_y / 150.0
    phase2 = base_y / 250.0
    phase3 = base_y / 50.0
    
    for x in range(0, width + 1, 10):
        # To tile perfectly on X, the angle must complete full cycles over 'width'.
        # Angle for x: 2 * pi * x / width
        a1 = 1 * 2 * math.pi * x / width
        a2 = 2 * 2 * math.pi * x / width
        a3 = 3 * 2 * math.pi * x / width
        
        # Superimpose sine waves
        # Keep amplitude moderate so lines don't cross too wildly
        y_offset = (
            math.sin(a1 + phase1) * 80 +
            math.cos(a2 + phase2) * 40 +
            math.sin(a3 + phase3) * 15
        )
        
        # To make it look like a map, we can scale the amplitude based on Y, 
        # but that might make them cross. Let's just use constant amplitude for each line.
        y = base_y + y_offset
        points.append(f"{x:.1f},{y:.1f}")
        
    d = "M " + " L ".join(points)
    # Thinner lines! stroke-width="1"
    lines.append(f'<path d="{d}" fill="none" stroke="black" stroke-width="1" />')

# Let's add a few isolated "hills" (loops) to make it look like topography rather than just waves
for cx, cy, r_max in [(600, 600, 150), (1800, 1500, 250), (400, 2000, 200), (1600, 300, 120)]:
    for r in range(20, r_max, 40):
        points = []
        for a in range(0, 361, 5):
            rad = math.radians(a)
            # Add some noise to the radius
            n = math.sin(rad * 3) * (r * 0.1) + math.cos(rad * 2) * (r * 0.15)
            curr_r = r + n
            x = cx + curr_r * math.cos(rad)
            y = cy + curr_r * math.sin(rad)
            points.append(f"{x:.1f},{y:.1f}")
            
        d = "M " + points[0] + " L " + " L ".join(points[1:]) + " Z"
        lines.append(f'<path d="{d}" fill="none" stroke="black" stroke-width="1" />')

svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">{" ".join(lines)}</svg>'

with open("public/topo.svg", "w") as f:
    f.write(svg)

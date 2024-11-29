import { Card, Image, Text, Button, Divider } from "@mantine/core";

const FavoritesPage = ({ favorites }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Text size="xl" weight={700} align="center" mb={10}>
        My Favorites
      </Text>
      <Divider w="full" mb={20} />
      {favorites.length > 0 ? (
        <div className="grid w-fit mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <Card key={fav._id} shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={`https://via.placeholder.com/300?text=${fav.item_code}`}
                  alt={fav.item_code}
                  height={200}
                />
              </Card.Section>
              <div className="flex-1">
                <Text weight={500} mt="md" size="lg">
                  Item Code: {fav.item_code}
                </Text>
                <Text size="sm" color="dimmed">
                  Added on: {new Date(fav.createdAt).toLocaleDateString()}
                </Text>
              </div>

              <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                className="mt-auto"
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Text align="center" size="lg" color="dimmed">
          No favorites added yet.
        </Text>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/fashion/user-favs`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch favorites");
    }
    const favorites = await res.json();
    return {
      props: {
        favorites,
      },
    };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return {
      props: {
        favorites: [],
      },
    };
  }
}

export default FavoritesPage;
